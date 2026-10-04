import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  clampPage,
  defaultView,
  hasListParams,
  parsePage,
  parseView,
  toParams,
  totalPagesOf,
  withFilters,
  withLimit,
  type ListSchema,
} from "../listStateCodec.ts";

type Filters = { status: string; sort: string; tab: string; from: string };

const SCHEMA: ListSchema<Filters> = {
  fields: {
    status: { kind: "enum", values: ["all", "active", "expired"], fallback: "all" },
    sort: { kind: "enum", values: ["recent", "name"], fallback: "recent" },
    // An older deep-link name keeps working.
    tab: { kind: "enum", values: ["active", "requests"], fallback: "active", param: "section" },
    from: { kind: "date" },
  },
  limits: [20, 50],
};

describe("restoring a view after a refresh", () => {
  it("reads back exactly what was written", () => {
    const view = { page: 3, limit: 50, filters: { status: "expired", sort: "name", tab: "requests", from: "2026-09-01" } };
    const query = Object.fromEntries(Object.entries(toParams(SCHEMA, view)).filter(([, value]) => value !== undefined));
    assert.deepEqual(query, { page: "3", limit: "50", status: "expired", sort: "name", section: "requests", from: "2026-09-01" });
    assert.deepEqual(parseView(SCHEMA, query), view);
  });

  it("leaves defaults out of the URL", () => {
    const params = toParams(SCHEMA, defaultView(SCHEMA));
    assert.ok(Object.values(params).every((value) => value === undefined));
  });

  it("can keep the page out (lists that append pages)", () => {
    const view = { ...defaultView(SCHEMA), page: 4 };
    assert.equal(toParams(SCHEMA, view, { includePage: false }).page, undefined);
  });

  it("can name its page differently when two lists share a route", () => {
    const second: ListSchema<Filters> = { ...SCHEMA, pageParam: "mpage" };
    assert.equal(parseView(second, { page: "5", mpage: "2" }).page, 2);
    assert.equal(toParams(second, { ...defaultView(second), page: 3 }).mpage, "3");
    assert.equal(hasListParams(second, { page: "5" }), false);
  });

  it("knows when the route carries the list's values", () => {
    assert.equal(hasListParams(SCHEMA, {}), false);
    assert.equal(hasListParams(SCHEMA, { compose: "1" }), false);
    assert.equal(hasListParams(SCHEMA, { section: "requests" }), true);
    assert.equal(hasListParams(SCHEMA, { page: "2" }), true);
  });
});

describe("sanitizing hand-edited or stale values", () => {
  it("turns any bad page into page 1", () => {
    for (const raw of [undefined, "", "abc", "NaN", "-2", "0", "2.5", "1e3", " ", "99999999999999999999"]) {
      assert.equal(parsePage(raw), 1, String(raw));
    }
    assert.equal(parsePage("7"), 7);
    assert.equal(parsePage(" 7 "), 7);
  });

  it("drops unknown filter values, sizes and dates", () => {
    const view = parseView(SCHEMA, { status: "deleted", sort: "<script>", limit: "1000", from: "2026-13-45", section: "x" });
    assert.deepEqual(view, defaultView(SCHEMA));
  });

  it("accepts only short identifiers for server-defined codes", () => {
    const coded: ListSchema<{ service: string }> = { fields: { service: { kind: "code" } }, limits: [20] };
    assert.equal(parseView(coded, { service: "prenatal_care" }).filters.service, "prenatal_care");
    assert.equal(parseView(coded, { service: "<img src=x>" }).filters.service, "");
    assert.equal(parseView(coded, { service: "x".repeat(41) }).filters.service, "");
  });

  it("takes the first of a repeated value", () => {
    assert.equal(parseView(SCHEMA, { page: ["4", "9"] }).page, 4);
  });
});

describe("reset rules", () => {
  const onPage3 = { ...defaultView(SCHEMA), page: 3 };

  it("goes back to page 1 when a filter changes", () => {
    assert.equal(withFilters(onPage3, { status: "active" }).page, 1);
  });

  it("goes back to page 1 when the page size changes", () => {
    assert.equal(withLimit(onPage3, 50).page, 1);
  });

  it("keeps the page when nothing actually changed", () => {
    assert.equal(withFilters(onPage3, { status: "all" }), onPage3);
    assert.equal(withLimit(onPage3, 20), onPage3);
  });
});

describe("clamping to the pages that exist", () => {
  it("counts pages, with at least one", () => {
    assert.equal(totalPagesOf(0, 20), 1);
    assert.equal(totalPagesOf(20, 20), 1);
    assert.equal(totalPagesOf(21, 20), 2);
  });

  it("moves a page past the end to the new last page", () => {
    assert.equal(clampPage(5, totalPagesOf(41, 20)), 3);
    assert.equal(clampPage(3, totalPagesOf(40, 20)), 2, "the last page's rows were deleted");
    assert.equal(clampPage(0, 4), 1);
    assert.equal(clampPage(2, 4), 2);
  });
});
