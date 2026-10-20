import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveApiBaseUrl } from "../apiBaseUrl.ts";

test("local web development follows the browser host instead of a stale LAN address", () => {
  assert.equal(resolveApiBaseUrl("http://192.168.8.34:3000/api", true, "localhost"), "http://localhost:3000/api");
  assert.equal(resolveApiBaseUrl("http://192.168.8.34:3000", true, "192.168.254.154"), "http://192.168.254.154:3000/api");
  assert.equal(resolveApiBaseUrl("http://localhost:3000/api/", true, "192.168.254.154"), "http://192.168.254.154:3000/api");
});

test("production, hosted APIs, native clients and non-local web hosts retain their configured API", () => {
  assert.equal(resolveApiBaseUrl("http://192.168.8.34:3000/api", false, "localhost"), "http://192.168.8.34:3000/api");
  assert.equal(resolveApiBaseUrl("https://api.example.test", true, "localhost"), "https://api.example.test/api");
  assert.equal(resolveApiBaseUrl("http://192.168.254.154:3000/api", true), "http://192.168.254.154:3000/api");
  assert.equal(resolveApiBaseUrl("http://192.168.8.34:3000", true, "preview.example.test"), "http://192.168.8.34:3000/api");
  assert.equal(resolveApiBaseUrl("", false), "http://localhost:5000/api");
  assert.equal(resolveApiBaseUrl("/api", true, "localhost"), "/api");
});
