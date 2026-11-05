import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { after, it } from "node:test";
import { existsSync } from "node:fs";
import { act, createElement } from "react";
import { createRoot } from "test-renderer";
import type { MasterlistScreenState } from "../hooks/useMasterlistScreen.ts";
import type { ResidentIdentity } from "../types.ts";

// Only external screen dependencies are replaced. The screen, list, paging,
// debounce and remote-data hooks run together against an in-memory API.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const supportUrl = new URL("./fixtures/historySearchSupport.ts", import.meta.url).href;
const stubs = new Map([
  ["expo-router", "router"], ["react-native", "native"],
  ["@/lib/listState/viewStateStore", "storage"],
  ["@/contexts/AuthContext", "auth"], ["@/components/feedback", "feedback"],
  ["@/features/immunization/selection", "selection"],
  ["@/hooks/realtime/useRealtimeRefetch", "realtime"],
  ["@/utils/errorToast/toastError", "toast"],
  ["@/features/users/admin/hooks/usersVersion", "version"],
  ["@/features/users/admin/hooks/useUserFilterState", "debounce"],
  ["../services/masterlistRecordsApi", "api"],
  ["./useMasterlistSummary", "summary"], ["./useServiceForms", "forms"],
  ["./useRecordDetail", "detail"], ["./useRecordDeletion", "deletion"],
]);
const loader = registerHooks({
  resolve(specifier, context, next) {
    const stub = stubs.get(specifier);
    if (stub) return { url: supportUrl, shortCircuit: true };
    if (specifier.startsWith("@/") || specifier.startsWith(".")) {
      const url = specifier.startsWith("@/")
        ? new URL(`../../../${specifier.slice(2)}`, import.meta.url)
        : new URL(specifier, context.parentURL);
      if (existsSync(`${url.pathname}.ts`)) return { url: `${url.href}.ts`, shortCircuit: true };
    }
    return next(specifier, context);
  },
});
after(() => loader.deregister());
const { useMasterlistScreen } = await import("../hooks/useMasterlistScreen.ts");
const support = await import("./fixtures/historySearchSupport.ts");
const patient = (id: string, fullName = "Example Patient"): ResidentIdentity => ({
  masterResidentId: id, fullName, dateOfBirth: "", sex: "", purok: "", hasAccount: false,
});

for (const isPhone of [false, true]) {
  it(`patient history search flow (${isPhone ? "phone append" : "web paging"})`, async () => {
    support.reset();
    let screen!: MasterlistScreenState;
    const Probe = () => { screen = useMasterlistScreen({ isPhone }); return null; };
    const root = createRoot();
    try {
      await act(async () => root.render(createElement(Probe)));
      await act(async () => screen.showHistory(patient("TEST-A")));
      assert.equal(screen.list.criteria.search, "Example Patient");
      assert.equal(support.lastQuery().search, "");
      assert.equal(support.lastQuery().masterResidentId, "TEST-A");
      assert.equal(screen.list.page, 1);
      assert.equal(screen.list.records[0]?._id, "record-a");

      // Identical names must resolve to distinct histories, replacing page data.
      let finishLoad!: () => void;
      support.apiState.pending = new Promise<void>((resolve) => { finishLoad = resolve; });
      await act(async () => screen.showHistory(patient("TEST-B")));
      assert.equal(screen.view, "loading");
      assert.equal(screen.list.records.length, 0);
      await act(async () => { finishLoad(); });
      support.apiState.pending = null;
      assert.equal(screen.list.criteria.search, "Example Patient");
      assert.equal(support.lastQuery().masterResidentId, "TEST-B");
      assert.deepEqual(screen.list.records.map((r) => r._id), ["record-b"]);

      await act(async () => screen.list.update({ search: "Other", masterResidentId: "" }));
      assert.equal(screen.list.criteria.masterResidentId, "");
      assert.equal(support.lastQuery().masterResidentId, "");
      await act(async () => new Promise((resolve) => setTimeout(resolve, 40)));
      assert.equal(support.lastQuery().search, "Other");
      assert.deepEqual(screen.list.records.map((r) => r._id), ["record-other"]);

      await act(async () => screen.showHistory(patient("TEST-A")));
      await act(async () => screen.list.update({ search: "", masterResidentId: "" }));
      assert.equal(screen.list.criteria.masterResidentId, "");
      await act(async () => new Promise((resolve) => setTimeout(resolve, 40)));
      assert.equal(support.lastQuery().search, "");
      assert.equal(screen.list.records.length, 3);

      await act(async () => screen.showHistory(patient("TEST-NONE", "")));
      assert.equal(screen.list.criteria.search, "");
      assert.equal(support.lastQuery().masterResidentId, "TEST-NONE");
      assert.equal(screen.view, "noResults");

      support.apiState.fail = true;
      await act(async () => screen.showHistory(patient("TEST-ERROR")));
      assert.equal(screen.view, "error");
      support.apiState.fail = false;
      await act(async () => screen.list.refresh());
      assert.equal(screen.view, "noResults");
    } finally {
      await act(async () => root.unmount());
    }
  });
}
