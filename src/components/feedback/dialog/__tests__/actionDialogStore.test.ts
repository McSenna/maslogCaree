import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  closeActionDialog,
  openActionDialog,
  subscribeToActionDialog,
  type ActionDialogRequest,
} from "../actionDialogStore.ts";

describe("actionDialogStore", () => {
  it("keeps every action, including more than two choices", () => {
    const seen: (ActionDialogRequest | null)[] = [];
    const unsubscribe = subscribeToActionDialog((request) => seen.push(request));

    openActionDialog("Profile photo", "Choose a photo", [
      { text: "Cancel", style: "cancel" },
      { text: "Take photo" },
      { text: "Choose from gallery" },
    ]);

    assert.deepEqual(
      seen.at(-1)?.actions.map((action) => action.text),
      ["Cancel", "Take photo", "Choose from gallery"]
    );

    closeActionDialog(seen.at(-1)!.id);
    assert.equal(seen.at(-1), null);
    unsubscribe();
  });

  it("ignores a close for a dialog that was already replaced", () => {
    const seen: (ActionDialogRequest | null)[] = [];
    const unsubscribe = subscribeToActionDialog((request) => seen.push(request));

    openActionDialog("First", undefined, [{ text: "OK" }]);
    const staleId = seen.at(-1)!.id;
    openActionDialog("Second", undefined, [{ text: "OK" }]);

    closeActionDialog(staleId);
    assert.equal(seen.at(-1)?.title, "Second");

    closeActionDialog(seen.at(-1)!.id);
    unsubscribe();
  });
});
