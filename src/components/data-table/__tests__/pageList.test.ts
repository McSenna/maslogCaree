import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildPageList, pageCountOf, rangeSummary } from "../pageList.ts";

describe("rangeSummary", () => {
  it("names the rows shown on this page", () => {
    assert.equal(rangeSummary(2, 20, 52, "users"), "Showing 21 to 40 of 52 users");
    assert.equal(rangeSummary(2, 20, 25, "records"), "Showing 21 to 25 of 25 records");
    assert.equal(rangeSummary(1, 20, 3, "requests"), "Showing 1 to 3 of 3 requests");
  });

  it("says there is nothing when the total is zero", () => {
    assert.equal(rangeSummary(1, 20, 0, "records"), "No records");
  });
});

describe("pageCountOf", () => {
  it("keeps a page count of at least one", () => {
    assert.equal(pageCountOf(0, 20), 1);
    assert.equal(pageCountOf(41, 20), 3);
  });
});

describe("buildPageList", () => {
  it("lists every page when there are seven or fewer", () => {
    assert.deepEqual(buildPageList(3, 5), [1, 2, 3, 4, 5]);
  });

  it("keeps the ends and the current page's neighbours, with gaps between", () => {
    assert.deepEqual(buildPageList(6, 12), [1, "ellipsis", 5, 6, 7, "ellipsis", 12]);
  });
});
