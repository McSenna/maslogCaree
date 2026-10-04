import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { NEWEST_ACCOUNTS_LIMIT, groupTotals, newestFirst } from "../newestAccounts.ts";

const account = (name: string, createdAt: string) => ({ name, createdAt });

describe("newestFirst", () => {
  it("keeps the five most recently created, newest first", () => {
    const accounts = ["01", "05", "03", "07", "02", "06", "04"].map((day) => account(`Oct ${day}`, `2026-10-${day}T08:00:00Z`));
    assert.deepEqual(
      newestFirst(accounts).map((entry) => entry.name),
      ["Oct 07", "Oct 06", "Oct 05", "Oct 04", "Oct 03"]
    );
    assert.equal(NEWEST_ACCOUNTS_LIMIT, 5);
  });

  it("shows every account when there are fewer than five", () => {
    const accounts = [account("Older", "2026-09-01T00:00:00Z"), account("Newer", "2026-10-01T00:00:00Z")];
    assert.deepEqual(newestFirst(accounts).map((entry) => entry.name), ["Newer", "Older"]);
  });

  it("puts an account with an unreadable date last instead of failing", () => {
    const accounts = [account("Broken", "not a date"), account("Fine", "2026-10-01T00:00:00Z")];
    assert.deepEqual(newestFirst(accounts).map((entry) => entry.name), ["Fine", "Broken"]);
  });

  it("does not reorder the list it was given", () => {
    const accounts = [account("A", "2026-01-01T00:00:00Z"), account("B", "2026-02-01T00:00:00Z")];
    newestFirst(accounts);
    assert.deepEqual(accounts.map((entry) => entry.name), ["A", "B"]);
  });
});

describe("groupTotals", () => {
  it("counts every account, not just the ones shown", () => {
    const distribution = [
      { role: "admin", count: 2 },
      { role: "doctor", count: 3 },
      { role: "resident", count: 140 },
    ];
    assert.deepEqual(groupTotals(145, distribution), { all: 145, residents: 140, staff: 5 });
  });

  it("treats a missing resident entry as none", () => {
    assert.deepEqual(groupTotals(4, []), { all: 4, residents: 0, staff: 4 });
  });
});
