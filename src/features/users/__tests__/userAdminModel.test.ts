import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ApiUser } from "../admin/userAdmin.types.ts";
import {
  TAB_COUNT,
  activeShareNote,
  initialsOf,
  toSignupRequest,
  toSummary,
  toUser,
  toUsers,
} from "../admin/userAdminModel.ts";
import { buildUsersCsv } from "../admin/userCsv.ts";
import { lastLoginLines, monthStartNote } from "../admin/userDates.ts";
import { applyStatusChanges, statusToastMessage } from "../admin/userStatusOverlay.ts";

// Test fixtures only: invented values, never real residents.
const apiUser = (overrides: Partial<ApiUser> = {}): ApiUser => ({
  _id: "u1",
  fullname: "Test Person Alpha",
  email: "alpha@example.test",
  role: "doctor",
  status: "active",
  address: "  Purok 1  ",
  profilePhoto: "",
  platformAccess: { web: true, mobile: true },
  createdAt: "2026-09-01T00:00:00.000Z",
  lastLogin: null,
  ...overrides,
});

describe("toUser", () => {
  it("maps API fields to the display type", () => {
    assert.deepEqual(toUser(apiUser()), {
      id: "u1",
      fullName: "Test Person Alpha",
      email: "alpha@example.test",
      role: "Doctor",
      access: "web_and_mobile",
      location: "Purok 1",
      status: "active",
      avatarUrl: null,
      createdAt: "2026-09-01T00:00:00.000Z",
      lastLoginAt: null,
    });
  });

  it("folds older status names into deactivated", () => {
    for (const status of ["inactive", "suspended", "deactivated"]) {
      assert.equal(toUser(apiUser({ status }))?.status, "deactivated");
    }
  });

  it("drops pending and rejected accounts, which belong to the request queue", () => {
    assert.equal(toUsers([apiUser({ status: "pending" }), apiUser({ status: "rejected" }), apiUser()]).length, 1);
  });

  it("marks residents mobile only and uppercases BHW", () => {
    const resident = toUser(apiUser({ role: "resident", status: "approved", platformAccess: { web: false, mobile: true } }));
    assert.equal(resident?.access, "mobile_only");
    assert.equal(toUser(apiUser({ role: "bhw" }))?.role, "BHW");
  });
});

describe("initialsOf", () => {
  it("takes the first letter of the first two words", () => {
    assert.equal(initialsOf("test person alpha"), "TP");
    assert.equal(initialsOf("  Single  "), "S");
    assert.equal(initialsOf(""), "");
  });
});

describe("summary", () => {
  const summary = toSummary({
    total: 10, staff: 4, residents: 6, active: 3, approved: 5, deactivated: 2,
    addedThisMonth: 1, pendingRequests: 7, rejectedRequests: 9,
  });

  it("counts approved residents as active", () => {
    assert.equal(summary.active, 8);
    assert.equal(TAB_COUNT.active(summary), 8);
  });

  it("feeds every tab badge", () => {
    assert.deepEqual(
      [TAB_COUNT.requests(summary), TAB_COUNT.rejected(summary), TAB_COUNT.deactivated(summary), TAB_COUNT.accounts?.(summary)],
      [7, 9, 2, 10]
    );
  });

  it("rounds the active share and handles an empty system", () => {
    assert.equal(activeShareNote(summary), "80% of all accounts");
    assert.equal(activeShareNote({ ...summary, total: 0, active: 0 }), "No accounts yet");
  });
});

describe("toSignupRequest", () => {
  it("maps a pending verification", () => {
    const request = toSignupRequest({
      _id: "r1",
      verificationStatus: "pending",
      registeredAt: "2026-09-30T02:00:00.000Z",
      resident: { fullname: "Test Applicant", email: "applicant@example.test", address: "Purok 3" },
    });
    assert.equal(request.role, "Resident");
    assert.equal(request.status, "pending");
    assert.equal(request.avatarUrl, null);
  });
});

describe("dates", () => {
  it("shows Never with no time when the user has not signed in", () => {
    assert.deepEqual(lastLoginLines(null), { date: "Never", time: "" });
  });

  it("names the first of the current month", () => {
    assert.match(monthStartNote(new Date(2026, 9, 2)), /^Since 1 \S+ 2026$/);
  });
});

describe("buildUsersCsv", () => {
  it("quotes cells and defuses formulas", () => {
    const user = toUser(apiUser({ fullname: "=HYPERLINK(\"x\")" }));
    assert.ok(user);
    const [, row] = buildUsersCsv([user]).split("\r\n");
    assert.ok(row.startsWith(`"'=HYPERLINK(""x"")"`), row);
    assert.ok(row.includes(`"Never"`), row);
  });
});

describe("applyStatusChanges", () => {
  const doctor = toUser(apiUser());
  const resident = toUser(apiUser({ _id: "u2", role: "resident", status: "deactivated" }));
  assert.ok(doctor && resident);

  it("hides changed rows outside all accounts", () => {
    const rows = applyStatusChanges([doctor, resident], [{ ids: ["u1"], action: "deactivate" }], "active");
    assert.deepEqual(rows.map((user) => user.id), ["u2"]);
  });

  it("changes the status in place on all accounts", () => {
    const rows = applyStatusChanges([doctor, resident], [{ ids: ["u2"], action: "reactivate" }], "accounts");
    assert.equal(rows[1].status, "approved");
    assert.equal(rows[0].status, "active");
  });

  it("words the toast for one or many users", () => {
    assert.equal(statusToastMessage(["Test Person"], "deactivate"), "Test Person deactivated.");
    assert.equal(statusToastMessage(["A", "B"], "reactivate"), "2 users reactivated.");
  });
});
