import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { defaultView, parseView, toParams, withFilters } from "../../../lib/listState/listStateCodec.ts";
import { MASTER_LIST_SCHEMA } from "../masterListFilters.ts";

describe("Master List filter state", () => {
  it("defaults to all roles, civil statuses and puroks", () => {
    assert.deepEqual(defaultView(MASTER_LIST_SCHEMA), {
      page: 1, limit: 20, filters: { role: "all", civilStatus: "all", purok: "all" },
    });
  });

  it("persists civil status and purok separately from account filters and old controls", () => {
    const raw = {
      role: "doctor", status: "approved", sort: "last_login_desc", page: "5",
      mrole: "bhw", mcivil: "married", mpurok: "Purok 2, Pangulo 2", mpage: "2",
      mstatus: "inactive", msort: "newest",
    };
    const view = parseView(MASTER_LIST_SCHEMA, raw);
    assert.deepEqual(view, { page: 2, limit: 20, filters: { role: "bhw", civilStatus: "married", purok: "Purok 2, Pangulo 2" } });
    assert.deepEqual(toParams(MASTER_LIST_SCHEMA, view), {
      mpage: "2", limit: undefined, mrole: "bhw", mcivil: "married", mpurok: "Purok 2, Pangulo 2",
    });
  });

  it("rejects unknown restored values and ignores the removed status and sort controls", () => {
    assert.deepEqual(parseView(MASTER_LIST_SCHEMA, {
      mrole: "admin", mcivil: "unknown", mpurok: "Purok 99", mstatus: "inactive", msort: "oldest",
    }).filters, { role: "all", civilStatus: "all", purok: "all" });
  });

  it("resets pagination for each filter and restores defaults when cleared", () => {
    for (const patch of [{ role: "midwife" }, { civilStatus: "married" }, { purok: "Purok 1, Centro" }] as const) {
      const changed = withFilters({ ...defaultView(MASTER_LIST_SCHEMA), page: 4 }, patch);
      assert.equal(changed.page, 1);
      assert.deepEqual(withFilters(changed, { role: "all", civilStatus: "all", purok: "all" }), defaultView(MASTER_LIST_SCHEMA));
    }
  });
});
