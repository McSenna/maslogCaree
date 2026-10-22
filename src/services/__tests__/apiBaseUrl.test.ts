import assert from "node:assert/strict";
import { test } from "node:test";
import { metroHostname, resolveApiBaseUrl } from "../apiBaseUrl.ts";

test("local web development follows the browser host instead of a stale LAN address", () => {
  assert.equal(resolveApiBaseUrl("http://192.168.8.34:3000/api", true, "localhost"), "http://localhost:3000/api");
  assert.equal(resolveApiBaseUrl("http://192.168.8.34:3000", true, "192.168.254.154"), "http://192.168.254.154:3000/api");
  assert.equal(resolveApiBaseUrl("http://localhost:3000/api/", true, "192.168.254.154"), "http://192.168.254.154:3000/api");
});

test("hosted APIs, unknown dev hosts and non-local web hosts retain their configured API", () => {
  assert.equal(resolveApiBaseUrl("https://api.example.test/api/", false, "maslogcare.com"), "https://api.example.test/api");
  assert.equal(resolveApiBaseUrl("https://api.example.test", true, "localhost"), "https://api.example.test/api");
  assert.equal(resolveApiBaseUrl("http://192.168.254.154:3000/api", true), "http://192.168.254.154:3000/api");
  assert.equal(resolveApiBaseUrl("http://192.168.8.34:3000", true, "preview.example.test"), "http://192.168.8.34:3000/api");
  assert.equal(resolveApiBaseUrl("", true), "http://localhost:3000/api");
  assert.equal(resolveApiBaseUrl("/api", true, "localhost"), "/api");
});

test("native development follows the Metro host, so a phone reaches the API on the same computer", () => {
  assert.equal(metroHostname("192.168.8.43:8081"), "192.168.8.43");
  assert.equal(metroHostname("10.0.2.2:8081"), "10.0.2.2");
  assert.equal(resolveApiBaseUrl("http://localhost:3000/api", true, metroHostname("192.168.8.43:8081")), "http://192.168.8.43:3000/api");
  assert.equal(resolveApiBaseUrl("http://192.168.254.154:3000/api", true, metroHostname("192.168.8.43:8081")), "http://192.168.8.43:3000/api");
});

test("native development keeps the configured API behind a tunnel or a USB loopback", () => {
  assert.equal(metroHostname("localhost:8081"), undefined);
  assert.equal(metroHostname("127.0.0.1:8081"), undefined);
  assert.equal(metroHostname(undefined), undefined);
  assert.equal(metroHostname(""), undefined);
  assert.equal(resolveApiBaseUrl("http://192.168.8.43:3000/api", true, metroHostname("localhost:8081")), "http://192.168.8.43:3000/api");
  assert.equal(resolveApiBaseUrl("http://192.168.8.43:3000/api", true, metroHostname("abc-8081.exp.direct")), "http://192.168.8.43:3000/api");
});

test("production rejects insecure and local API addresses before REST and sockets can connect", () => {
  for (const url of [
    "http://192.168.254.154:3000/api",
    "http://api.example.test/api",
    "https://localhost:3000/api",
    "https://127.0.0.1:3000/api",
    "https://192.168.254.154:3000/api",
    "https://10.0.0.1/api",
    "https://172.16.0.1/api",
    "//api.example.test/api",
    "invalid-url",
    "",
    undefined,
  ]) {
    assert.throws(() => resolveApiBaseUrl(url, false), /EXPO_PUBLIC_API_URL/);
  }
});

test("production supports HTTPS backends and same-origin API proxies", () => {
  assert.equal(resolveApiBaseUrl(" https://api.example.test/ ", false), "https://api.example.test/api");
  assert.equal(resolveApiBaseUrl("/api/", false, "maslogcare.com"), "/api");
});

test("production errors name the rejected value so a broken build is easy to trace", () => {
  assert.throws(() => resolveApiBaseUrl("http://192.168.8.43:3000/api", false), /"http:\/\/192\.168\.8\.43:3000\/api"/);
  assert.throws(() => resolveApiBaseUrl(undefined, false), /EXPO_PUBLIC_API_URL is not set/);
  assert.throws(() => resolveApiBaseUrl("  ", false), /EXPO_PUBLIC_API_URL is not set/);
});
