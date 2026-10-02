import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { clearActivitySearch, handOffActivitySearch, peekActivitySearch } from "../activitySearchHandoff.ts";

describe("activity search handoff", () => {
  it("is empty on a direct visit", () => {
    clearActivitySearch();
    assert.equal(peekActivitySearch(), "");
  });

  it("passes a trimmed term once", () => {
    handOffActivitySearch("  person@example.test ");
    assert.equal(peekActivitySearch(), "person@example.test");
    clearActivitySearch();
    assert.equal(peekActivitySearch(), "");
  });

  it("treats blank and missing terms as no filter", () => {
    handOffActivitySearch("   ");
    assert.equal(peekActivitySearch(), "");
    handOffActivitySearch(null);
    assert.equal(peekActivitySearch(), "");
  });
});
