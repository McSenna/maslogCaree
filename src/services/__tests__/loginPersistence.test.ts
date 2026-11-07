import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const load = <T>(path: string, modules: Record<string, unknown>): T => {
  const exports = {};
  const source = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(source, { exports, require: (id: string) => {
    assert.ok(id in modules, `unexpected dependency ${id}`); return modules[id];
  } });
  return exports as T;
};
type LoginResult = { success: boolean; code?: string };
type Actions = { login: (email: string, password: string, signal: AbortSignal) => Promise<LoginResult> };

const setup = () => {
  let writes = 0;
  let userChanges = 0;
  let resolve: (data: unknown) => void = () => assert.fail("login has not started");
  const storage = { setStoredUser: () => { writes++; }, clearStoredUser: () => {} };
  const authApi = load<Record<string, unknown>>("../auth/authApi.ts", {
    "@/services/api": { post: () => new Promise((done) => { resolve = (data) => done({ data }); }) },
    "@/config/platformAccess": { CLIENT_PLATFORM: "mobile" },
    "@/utils/storage": storage,
    "./authTypes": { toStoredUser: () => ({}) },
  });
  const actions = load<{ useAuthActions: (options: { setUser: () => void }) => Actions }>("../../contexts/auth/useAuthActions.ts", {
    "@/services/residentWebBlock": { setResidentWebBlocked: () => {} },
    react: { useCallback: (callback: unknown) => callback },
    "@/services/api": {},
    "@/config/platformAccess": { CLIENT_PLATFORM: "mobile", isPlatformAllowed: () => true },
    "@/services/auth": authApi,
    "@/utils/errorCodes": { ERROR_CODES: { REQUEST_CANCELLED: "REQUEST_CANCELLED" } },
    "@/utils/apiErrorHandler": { normalizeApiError: () => ({ code: "INVALID_CREDENTIALS" }) },
    "@/utils/errorReporting": { reportError: () => {} },
    "@/utils/storage": storage,
    "@/services/authEvents": {},
    "@/features/notifications/services/pushTokenRegistry": {},
    "./authUserMapping": { toCurrentUser: () => ({ role: "resident" }), toStoredUser: () => ({}) },
  }).useAuthActions({ setUser: () => { userChanges++; } });
  return { actions, resolve: () => resolve({ token: "synthetic-token-never-log", user: { role: "resident" } }),
    writes: () => writes, userChanges: () => userChanges };
};

test("a login response arriving after cancellation cannot persist or apply its token", async () => {
  const h = setup();
  const controller = new AbortController();
  const pending = h.actions.login("synthetic@example.test", "Synthetic123", controller.signal);
  controller.abort();
  h.resolve();
  assert.equal((await pending).code, "REQUEST_CANCELLED");
  assert.equal(h.writes(), 0);
  assert.equal(h.userChanges(), 0);
});

test("a successful login applies and persists the session once", async () => {
  const h = setup();
  const pending = h.actions.login("synthetic@example.test", "Synthetic123", new AbortController().signal);
  h.resolve();
  assert.equal((await pending).success, true);
  assert.equal(h.writes(), 1);
  assert.equal(h.userChanges(), 1);
});
