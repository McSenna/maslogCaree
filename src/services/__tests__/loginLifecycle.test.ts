import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import * as React from "react";
import { createRoot } from "test-renderer";
import { useLoginCancellation } from "../../features/auth/hooks/useLoginCancellation.ts";
import { checkLoginEmail, checkPassword } from "../../features/auth/webLogin/loginIdentifier.ts";
import type { useLoginForm } from "../../features/auth/hooks/useLoginForm.ts";
import type { useWebLogin } from "../../features/auth/webLogin/useWebLogin.ts";

Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);
type Result = { success: boolean; role?: "admin"; code?: string };
type Form = ReturnType<typeof useLoginForm>;
type WebForm = ReturnType<typeof useWebLogin>;

const harness = (web: boolean) => {
  let calls = 0;
  let notices = 0;
  let navigations = 0;
  let signal: AbortSignal | undefined;
  let resolve: (value: Result) => void = () => assert.fail("no pending login");
  const login = (_email: string, _password: string, nextSignal: AbortSignal) => {
    calls++; signal = nextSignal;
    return new Promise<Result>((done) => { resolve = done; });
  };
  const exports: { useLoginForm?: typeof useLoginForm; useWebLogin?: typeof useWebLogin } = {};
  const path = web ? "../../features/auth/webLogin/useWebLogin.ts" : "../../features/auth/hooks/useLoginForm.ts";
  const source = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const modules: Record<string, unknown> = {
    react: React, "expo-router": { useRouter: () => ({ replace: () => { navigations++; } }) },
    "@/contexts/AuthContext": { useAuth: () => ({ login }) },
    "@/config/roleRoutes": { getDashboardPath: () => "/admin/dashboard" },
    "@/utils/errorCodes": { PLATFORM_DENIED_CODES: [] },
    "./useLoginCancellation": { useLoginCancellation }, "../hooks/useLoginCancellation": { useLoginCancellation },
    "../webLogin/loginIdentifier": { checkLoginEmail, checkPassword }, "./loginIdentifier": { checkLoginEmail, checkPassword },
    "./loginFailureToast": { toastLoginFailed: () => { notices++; }, toastLoginRefused: () => { notices++; } },
    "../hooks/loginFailureToast": { toastLoginFailed: () => { notices++; }, toastLoginRefused: () => { notices++; } },
  };
  vm.runInNewContext(source, { exports, require: (id: string) => {
    assert.ok(id in modules, `unexpected dependency ${id}`); return modules[id];
  } });
  return { exports, result: (value: Result) => resolve(value), calls: () => calls,
    notices: () => notices, navigations: () => navigations, signal: () => signal };
};

test("mobile modal blocks duplicate taps, aborts on close and ignores a late success", async () => {
  const h = harness(false);
  let form: Form;
  const Hook = ({ active }: { active: boolean }) => { form = h.exports.useLoginForm!({ active }); return null; };
  const root = createRoot();
  await React.act(async () => { root.render(React.createElement(Hook, { active: true })); });
  await React.act(async () => { form.setEmail("synthetic@example.test"); form.setPassword("Synthetic123"); });
  let pending: Promise<unknown>;
  await React.act(async () => { pending = form.submit(); void form.submit(); });
  assert.equal(h.calls(), 1);
  assert.equal(form!.isSubmitting, true);
  await React.act(async () => { root.render(React.createElement(Hook, { active: false })); });
  assert.equal(h.signal()?.aborted, true);
  await React.act(async () => { h.result({ success: true, role: "admin" }); await pending; });
  assert.equal(h.navigations(), 0);
  assert.equal(h.notices(), 0);
  assert.equal(form!.isSubmitting, false);
  await React.act(async () => root.unmount());
});

test("web login can recover after failure and aborts when navigation unmounts it", async () => {
  const h = harness(true);
  let form: WebForm;
  const Hook = () => { form = h.exports.useWebLogin!(); return null; };
  const root = createRoot();
  await React.act(async () => { root.render(React.createElement(Hook)); });
  await React.act(async () => { form.setIdentifier("synthetic@example.test"); form.setPassword("Synthetic123"); });
  let pending: Promise<unknown>;
  await React.act(async () => { pending = form.submit(); void form.submit(); });
  assert.equal(h.calls(), 1);
  await React.act(async () => { h.result({ success: false, code: "TIMEOUT_ERROR" }); await pending; });
  assert.equal(form!.status, "idle");
  assert.equal(h.notices(), 1);
  await React.act(async () => { pending = form.submit(); });
  assert.equal(h.calls(), 2);
  await React.act(async () => root.unmount());
  assert.equal(h.signal()?.aborted, true);
  await React.act(async () => { h.result({ success: true, role: "admin" }); await pending; });
  assert.equal(h.navigations(), 0);
});
