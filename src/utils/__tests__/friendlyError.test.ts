import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DEFAULT_ERROR_MESSAGE, friendlyErrorMessage } from "../friendlyError.ts";

describe("friendlyErrorMessage", () => {
  it("keeps short, human-written messages", () => {
    assert.equal(friendlyErrorMessage("The queue could not be loaded."), "The queue could not be loaded.");
  });

  it("hides raw transport and runtime errors", () => {
    for (const raw of [
      "Request failed with status code 500",
      "Network Error",
      "TypeError: Cannot read properties of undefined (reading 'map')",
      "connect ECONNREFUSED 127.0.0.1:5000",
      "<!DOCTYPE html><html>502 Bad Gateway</html>",
      "    at fetchQueue (queue.ts:12:4)",
      "Internal error",
      "Internal Server Error",
      "Service unavailable",
      "Gateway Timeout",
    ]) {
      assert.equal(friendlyErrorMessage(raw), DEFAULT_ERROR_MESSAGE, raw);
    }
  });

  it("falls back for empty or oversized input and honours a custom fallback", () => {
    assert.equal(friendlyErrorMessage(null), DEFAULT_ERROR_MESSAGE);
    assert.equal(friendlyErrorMessage("   "), DEFAULT_ERROR_MESSAGE);
    assert.equal(friendlyErrorMessage("x".repeat(400), "Try again later."), "Try again later.");
  });
});
