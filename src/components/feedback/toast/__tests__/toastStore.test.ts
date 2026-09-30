import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  dismissToast,
  registerToastLayer,
  subscribeToToasts,
  subscribeToTopToastLayer,
  toast,
  type ToastMessage,
} from "../toastStore.ts";

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

  it("keeps one toast when the same outcome is reported twice", () => {
    const seen: (ToastMessage | null)[] = [];
    const unsubscribe = subscribeToToasts((message) => seen.push(message));

    const first = toast.error("Stock not released", "Only 3 left.");
    const second = toast.error("Stock not released", "Only 3 left.");
    assert.equal(first, second);
    assert.notEqual(seen.at(-1), seen.at(-2), "a fresh object restarts the dismiss timer");

    const different = toast.error("Stock not released", "Only 2 left.");
    assert.notEqual(different, first);

    dismissToast();
    unsubscribe();
  });

  it("does not let a success reuse a failure's toast", () => {
    const failed = toast.error("Saved");
    const saved = toast.success("Saved");
    assert.notEqual(failed, saved);
    dismissToast();
  });

  it("draws toasts on the most recently opened layer", () => {
    const tops: (number | null)[] = [];
    const unsubscribe = subscribeToTopToastLayer((top) => tops.push(top));

    const root = registerToastLayer();
    const modal = registerToastLayer();
    const nested = registerToastLayer();
    assert.equal(tops.at(-1), nested.id);

    modal.unregister();
    assert.equal(tops.at(-1), nested.id, "closing a lower modal leaves the top one");
    nested.unregister();
    assert.equal(tops.at(-1), root.id);
    nested.unregister();
    assert.equal(tops.at(-1), root.id, "unregistering twice is harmless");

    root.unregister();
    assert.equal(tops.at(-1), null);
    unsubscribe();
  });
});
