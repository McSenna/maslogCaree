import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { create, AxiosError } from "axios";
import { installRequestTransport } from "../requestTransport.ts";

// Expo runtime modules cannot run in Node. Keep the real Axios interceptor
// chain and substitute only platform/storage/UI boundaries.
const makeClient = (status = 401) => {
  let token: string | null = "old-session";
  let signOuts = 0;
  const releases: (() => void)[] = [];
  const client = create();
  client.defaults.adapter = (config) => new Promise((_resolve, reject) => {
    releases.push(() => reject(new AxiosError("refused", "ERR_BAD_REQUEST", config, {}, {
      status, statusText: "refused", data: {}, headers: {}, config,
    })));
  });
  const source = ts.transpileModule(readFileSync(new URL("../api.ts", import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const exports: Record<string, unknown> = {};
  const modules: Record<string, unknown> = {
    axios: { create: () => client }, "expo-constants": {},
    "./apiBaseUrl": { resolveApiBaseUrl: () => "https://api.example.test/api" },
    "@/config/platformAccess": { CLIENT_PLATFORM: "mobile" },
    "@/utils/storage": { getCachedAccessToken: () => token, getStoredUser: () => ({ role: "resident" }) },
    "@/services/authEvents": { forceLogout: () => { signOuts++; token = null; } },
    "@/utils/apiErrorHandler": { ApiError: Error, normalizeApiError: () => ({ isAuthError: status === 401 }) },
    "@/utils/apiError/errorClassification": { isUnreadableJsonBody: () => false },
    "@/utils/errorCodes": { ERROR_CODES: {} },
    "./requestTransport": { installRequestTransport },
  };
  vm.runInNewContext(source, { exports, require: (id: string) => {
    assert.ok(id in modules, `unexpected runtime dependency ${id}`);
    return modules[id];
  }, __DEV__: false, process: { env: {} }, AbortController, setTimeout, clearTimeout });
  return { client, setToken: (value: string | null) => { token = value; },
    release: () => { for (const release of releases) release(); }, signOuts: () => signOuts };
};

test("late 401 from the previous token cannot end a newly signed-in session", async () => {
  const h = makeClient();
  const request = h.client.get("/profile").catch(() => undefined);
  await new Promise((resolve) => setImmediate(resolve));
  h.setToken("new-session");
  h.release();
  await request;
  assert.equal(h.signOuts(), 0, "an obsolete request signed out the current session");
});

test("concurrent expired-token requests end the current session once", async () => {
  const h = makeClient();
  const pending = Array.from({ length: 4 }, () => h.client.get("/profile").catch(() => undefined));
  await new Promise((resolve) => setImmediate(resolve));
  h.release();
  await Promise.all(pending);
  assert.equal(h.signOuts(), 1);
});

test("invalid credentials and temporary failures do not end a session", async () => {
  for (const status of [401, 500]) {
    const h = makeClient(status);
    const request = h.client.post(status === 401 ? "/login" : "/profile").catch(() => undefined);
    await new Promise((resolve) => setImmediate(resolve));
    h.release();
    await request;
    assert.equal(h.signOuts(), 0);
  }
});
