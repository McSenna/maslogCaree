import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { dismissToast, subscribeToToasts, toast, type ToastMessage } from "../toastStore.ts";

describe("toastStore", () => {
  it("replaces the visible toast and only dismisses the matching id", () => {
    const seen: (ToastMessage | null)[] = [];
    const unsubscribe = subscribeToToasts((message) => seen.push(message));

    const first = toast.success("Appointment booked");
    const second = toast.error("Unable to save", "Try again");
    dismissToast(first);
    assert.equal(seen.at(-1)?.id, second);

    dismissToast(second);
    assert.equal(seen.at(-1), null);
    unsubscribe();
  });

  it("keeps errors on screen longer than confirmations", () => {
    let latest: ToastMessage | null = null;
    const unsubscribe = subscribeToToasts((message) => {
      latest = message;
    });
    toast.success("Saved");
    const successMs = (latest as ToastMessage | null)?.durationMs ?? 0;
    toast.error("Failed");
    const errorMs = (latest as ToastMessage | null)?.durationMs ?? 0;
    assert.ok(errorMs > successMs);
    dismissToast();
    unsubscribe();
  });
});
