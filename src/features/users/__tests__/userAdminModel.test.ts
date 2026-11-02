import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ApiUser, ApiUserSummary } from "../admin/userAdmin.types.ts";
import { TAB_COUNT, activeShareNote, initialsOf, pageAfterChange, segmentOf, statusOptionsFor, statusParamOf, toSummary, toUser, toUsers } from "../admin/userAdminModel.ts";
import { lastLoginLines } from "../admin/userDates.ts";

// Test fixtures only: invented values, never real residents.
const apiUser = (overrides: Partial<ApiUser> = {}): ApiUser => ({
  id: "u1",
  fullname: "Test Person Alpha",
  email: "alpha@example.test",
  role: "doctor",
  status: "active",
  statusGroup: "active",
  location: "  Purok 1  ",
  avatarUrl: "",
  lastLogin: null,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-02T00:00:00.000Z",
  verificationId: null,
  portalAccess: { web: true, mobile: true, override: null, globalEnabled: false, eligible: true, revision: 0, state: "staff" },
  ...overrides,
});

const summary: ApiUserSummary = { total: 10, staff: 3, residents: 7, active: 6, approved: 1, requests: 1, rejected: 1, deactivated: 2, activePercent: 60, masterlist: 40 };

describe("toUser", () => {
  it("maps API fields to the display type", () => {
    const user = toUser(apiUser());
    assert.equal(user?.id, "u1");
    assert.equal(user?.fullName, "Test Person Alpha");
    assert.equal(user?.role, "Doctor");
    assert.equal(user?.status, "active");
    assert.equal(user?.location, "Purok 1");
    assert.equal(user?.avatarUrl, null);
    assert.equal(user?.lastLoginAt, null);
    assert.equal(user?.updatedAt, "2026-09-02T00:00:00.000Z");
    assert.equal(user?.portalAccess.state, "staff");
  });

  it("reads the status from the server's group, so older stored names read as Deactivated", () => {
    assert.equal(toUser(apiUser({ status: "suspended", statusGroup: "deactivated" }))?.status, "deactivated");
    assert.equal(toUser(apiUser({ status: "pending", statusGroup: "requested", verificationId: "v1" }))?.verificationId, "v1");
  });

  it("drops a record with an unknown role", () => {
    assert.deepEqual(toUsers([apiUser({ role: "owner" }), apiUser({ id: "u2" })]).map((user) => user.id), ["u2"]);
  });
});

describe("initialsOf", () => {
  it("uses the first letters of the first two words", () => {
    assert.equal(initialsOf("test person alpha"), "TP");
    assert.equal(initialsOf("  Solo  "), "S");
  });
});

describe("summary", () => {
  it("keeps the server's own counts", () => {
    const mapped = toSummary(summary);
    assert.equal(mapped.active, 6);
    assert.equal(mapped.requests, 1);
    assert.equal(mapped.activePercent, 60);
  });

  it("counts each segment from its own number", () => {
    const mapped = toSummary(summary);
    assert.equal(TAB_COUNT.active?.(mapped), 6);
    assert.equal(TAB_COUNT.requests?.(mapped), 1);
    assert.equal(TAB_COUNT.rejected?.(mapped), 1);
    assert.equal(TAB_COUNT.deactivated?.(mapped), 2);
    assert.equal(TAB_COUNT.accounts?.(mapped), 10);
  });

  it("words the Active card's chip", () => {
    assert.equal(activeShareNote(toSummary(summary)), "60% of accounts");
    assert.equal(activeShareNote(toSummary({ ...summary, total: 0 })), "No accounts yet");
  });
});

describe("API parameters", () => {
  it("keeps ?section=accounts links working by sending the all segment", () => {
    assert.equal(segmentOf("accounts"), "all");
    assert.equal(segmentOf("requests"), "requests");
  });

  it("leaves the status off for all statuses", () => {
    assert.equal(statusParamOf("all"), undefined);
    assert.equal(statusParamOf("approved"), "approved");
  });
});

describe("dates", () => {
  it("reads Never with no time line before the first sign-in", () => {
    assert.deepEqual(lastLoginLines(null), { date: "Never", time: "" });
  });

  it("gives a date and a time after one", () => {
    const lines = lastLoginLines("2026-09-20T08:05:00.000Z");
    assert.match(lines.date, /2026/);
    assert.ok(lines.time.length > 0);
  });
});

describe("statusOptionsFor", () => {
  it("offers approved and active inside the Active list", () => {
    assert.deepEqual(statusOptionsFor("active"), ["approved", "active"]);
  });

  it("offers nothing for a list of one state, so the select is disabled", () => {
    assert.deepEqual(statusOptionsFor("deactivated"), []);
    assert.deepEqual(statusOptionsFor("requests"), []);
  });

  it("offers all five in All accounts", () => {
    assert.equal(statusOptionsFor("accounts").length, 5);
  });
});

describe("pageAfterChange", () => {
  it("stays put while the page still has rows", () => {
    assert.equal(pageAfterChange(3, 41, 20), 3);
  });

  it("moves back when the only row on the last page leaves", () => {
    assert.equal(pageAfterChange(3, 40, 20), 2);
  });

  it("stays on page one when nothing is left", () => {
    assert.equal(pageAfterChange(1, 0, 20), 1);
  });
});
