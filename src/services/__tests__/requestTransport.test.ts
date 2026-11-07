import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import http from "node:http";
import { create, AxiosError, AxiosHeaders, CanceledError, isAxiosError, isCancel } from "axios";
import { getRequestDiagnostics, installRequestTransport } from "../requestTransport.ts";
import { retryDelay } from "../retryPolicy.ts";

let baseURL = "";
const calls = new Map<string, number>();
const ids = new Map<string, unknown[]>();
const server = http.createServer((req, res) => {
  const route = req.url ?? "/";
  const count = (calls.get(route) ?? 0) + 1;
  calls.set(route, count);
  ids.set(route, [...(ids.get(route) ?? []), req.headers["x-request-id"]]);
  res.setHeader("Content-Type", "application/json");
  if (route.includes("drop")) { req.socket.destroy(); return; }
  if (route.includes("slow")) { const timer = setTimeout(() => res.end("{}"), 300); res.on("close", () => clearTimeout(timer)); return; }
  if (route.includes("recover") && count < 3) { res.writeHead(503); res.end("{}"); return; }
  if (route.includes("guidance")) { res.writeHead(503, { "Retry-After": "60" }); res.end("{}"); return; }
  const status = Number(route.split("/").pop());
  res.statusCode = Number.isInteger(status) && status >= 400 && status < 600 ? status : 200;
  res.end("{}");
});
before(async () => {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  baseURL = `http://127.0.0.1:${address.port}`;
});
after(async () => { server.closeAllConnections(); await new Promise<void>((resolve) => server.close(() => resolve())); });
const client = (timeout = 1500) => {
  const result = create({ baseURL, timeout, proxy: false });
  installRequestTransport(result);
  return result;
};

test("transient reads recover in three attempts sharing a correlation ID", async () => {
  assert.equal((await client().get("/recover")).status, 200);
  assert.equal(calls.get("/recover"), 3);
  assert.equal(new Set(ids.get("/recover")).size, 1);
  assert.equal(getRequestDiagnostics().at(-1)?.retries, 2);
});
test("interrupted read connections have a finite retry limit", async () => {
  await assert.rejects(client().get("/drop"));
  assert.equal(calls.get("/drop"), 3);
});
test("login and other mutations never retry even on a transient status", async () => {
  for (const method of ["post", "put", "patch", "delete"] as const) {
    const path = `/${method}/503`;
    await assert.rejects(client().request({ url: path, method, data: { password: "do-not-record" } }));
    assert.equal(calls.get(path), 1);
  }
});
test("credential, authorization and validation refusals do not retry", async () => {
  for (const status of [400, 401, 403, 404, 409, 422, 500]) {
    const path = `/refused/${status}`;
    await assert.rejects(client().get(path));
    assert.equal(calls.get(path), 1);
  }
});
test("a slow response has one finite deadline and is not replayed", async () => {
  const started = Date.now();
  await assert.rejects(client(60).get("/slow"), (error: unknown) => isAxiosError(error) && ["ETIMEDOUT", "ECONNABORTED"].includes(error.code ?? ""));
  assert.ok(Date.now() - started < 250);
  assert.equal(calls.get("/slow"), 1);
  assert.equal(getRequestDiagnostics().at(-1)?.category, "timeout");
});
test("server guidance beyond the budget surfaces the refusal without an early retry", async () => {
  await assert.rejects(client(100).get("/guidance"));
  assert.equal(calls.get("/guidance"), 1);
});
test("cancellation during a response and during retry backoff stops pending work", async () => {
  for (const path of ["/cancel/slow", "/cancel/503"]) {
    const controller = new AbortController();
    const pending = client().get(path, { signal: controller.signal });
    setTimeout(() => controller.abort(), 30);
    await assert.rejects(pending, (error: unknown) => isCancel(error));
    assert.equal(calls.get(path), 1);
    assert.equal(getRequestDiagnostics().at(-1)?.category, "cancelled");
  }
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(client().get("/never-sent", { signal: controller.signal }));
  assert.equal(calls.has("/never-sent"), false);
});
test("diagnostics are bounded and omit URLs, secrets, bodies and identifiers", async () => {
  const api = client();
  for (let index = 0; index < 55; index++) await api.get(`/private-record-id?secret=hidden`, { headers: { Authorization: "Bearer secret-token" } });
  const diagnostics = getRequestDiagnostics();
  assert.equal(diagnostics.length, 50);
  assert.doesNotMatch(JSON.stringify(diagnostics), /private-record-id|hidden|secret-token|do-not-record/);
});
test("known browser offline state fails without sending or retrying", async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", { value: { onLine: false }, configurable: true });
  try {
    await assert.rejects(client().get("/offline"), (error: unknown) => isAxiosError(error) && error.code === "ERR_NETWORK");
    assert.equal(calls.has("/offline"), false);
    assert.equal(getRequestDiagnostics().at(-1)?.retries, 0);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "navigator", descriptor);
    else Reflect.deleteProperty(globalThis, "navigator");
  }
});
test("retry guidance accepts seconds and HTTP dates, never retries timeout/cancel", () => {
  const config = create().defaults;
  const error = new AxiosError("busy", "ERR_BAD_RESPONSE", undefined, {}, {
    status: 429, statusText: "busy", headers: { "retry-after": "2" }, data: {}, config: { headers: new AxiosHeaders() },
  });
  const request = { ...config, headers: new AxiosHeaders(), method: "get" };
  assert.equal(retryDelay(error, request, 0), 2000);
  if (error.response) error.response.headers["retry-after"] = new Date(Date.now() + 10000).toUTCString();
  assert.ok((retryDelay(error, request, 0) ?? 0) >= 8500);
  assert.equal(retryDelay(error, request, 2), null);
  assert.equal(retryDelay(new AxiosError("timeout", "ECONNABORTED"), request, 0), null);
  assert.equal(retryDelay(new CanceledError(), request, 0), null);
});
