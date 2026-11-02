import assert from "node:assert/strict";
import { it } from "node:test";
import {
  clearImmunizationSelection,
  getImmunizationSelection,
  openImmunizationBaby,
} from "../selectionStore.ts";
it("keeps notification baby selection only in memory and clears it", () => {
  openImmunizationBaby("test-baby");
  assert.equal(getImmunizationSelection(), "test-baby");
  clearImmunizationSelection();
  assert.equal(getImmunizationSelection(), null);
});

it("opens the checklist without inventing a baby identifier", async () => {
  const store = await import("../selectionStore.ts");
  const before = store.getChecklistRequestVersion();
  store.requestImmunizationChecklist();
  assert.equal(store.getChecklistRequestVersion(), before + 1);
  assert.equal(store.getImmunizationSelection(), null);
  assert.equal(store.getImmunizationEditorRequest(), true);
  store.clearImmunizationEditorRequest();
  assert.equal(store.getImmunizationEditorRequest(), false, "closing the editor cannot reopen it on remount");
  store.requestImmunizationChecklist();
  store.clearImmunizationSelection();
  assert.equal(store.getImmunizationEditorRequest(), false, "sign-out clears a pending clinical editor request");
});
