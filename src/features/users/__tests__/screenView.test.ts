import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { pageCount, rangeLine } from "../admin/hooks/screenView.ts";

describe("rangeLine", () => {
  it("counts users by default", () => {
    assert.equal(rangeLine(2, 20, 20, 52), "Showing 21 to 40 of 52 users");
  });

  it("names the rows the tab lists", () => {
    assert.equal(rangeLine(1, 20, 3, 3, "requests"), "Showing 1 to 3 of 3 requests");
    assert.equal(rangeLine(1, 20, 0, 0, "requests"), "No requests");
  });

  it("keeps a page count of at least one", () => {
    assert.equal(pageCount(0, 20), 1);
    assert.equal(pageCount(41, 20), 3);
  });
});
