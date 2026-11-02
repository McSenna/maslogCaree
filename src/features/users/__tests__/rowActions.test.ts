import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ROW_ACTION_ITEMS, rowActions } from "../admin/rowActions.ts";
import { COLUMN_WIDTHS, INLINE_ACTIONS_WIDTH, actionWidthsForPermission } from "../admin/userColumnWidths.ts";
import type { PortalAccess, User } from "../admin/userAdmin.types.ts";

const access = (overrides: Partial<PortalAccess> = {}): PortalAccess => ({
  web: false,
  mobile: true,
  override: null,
  globalEnabled: false,
  eligible: true,
  revision: 0,
  state: "global_blocked",
  ...overrides,
});

// Test fixtures only: invented values, never real residents.
const user = (overrides: Partial<User> = {}): User => ({
  id: "u1",
  fullName: "Test Person",
  email: "person@example.test",
  role: "Resident",
  status: "active",
  location: "",
  avatarUrl: null,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
  lastLoginAt: null,
  verificationId: null,
  portalAccess: access(),
  ...overrides,
});

describe("rowActions", () => {
  it("offers a request's two decisions and nothing else", () => {
    assert.deepEqual(rowActions(user({ status: "requested" }), "admin"), ["approve", "reject"]);
  });

  it("offers Approve but never Reject on a rejected request", () => {
    assert.deepEqual(rowActions(user({ status: "rejected" }), "admin"), ["approve"]);
  });

  it("offers Enable web access to a resident the web currently blocks, for the designated admin", () => {
    assert.deepEqual(rowActions(user(), "admin", true), ["edit", "deactivate", "resetPassword", "allowWeb"]);
  });

  it("offers no web access action to other admins, on any resident", () => {
    const allowed = user({ portalAccess: access({ web: true, state: "global_allowed", globalEnabled: true }) });
    assert.deepEqual(rowActions(user(), "admin", false), ["edit", "deactivate", "resetPassword"]);
    assert.deepEqual(rowActions(allowed, "admin", false), ["edit", "deactivate", "resetPassword"]);
    assert.deepEqual(rowActions(user(), "admin"), ["edit", "deactivate", "resetPassword"], "hidden unless the server said otherwise");
  });

  it("offers Disable web access to a resident the web currently allows", () => {
    const allowed = user({ status: "approved", portalAccess: access({ web: true, state: "global_allowed", globalEnabled: true }) });
    assert.deepEqual(rowActions(allowed, "admin", true), ["edit", "deactivate", "resetPassword", "blockWeb"]);
  });

  it("has no web access items for staff", () => {
    const staff = user({ role: "Midwife", portalAccess: access({ web: true, state: "staff" }) });
    assert.deepEqual(rowActions(staff, "admin"), ["edit", "deactivate", "resetPassword"]);
  });

  it("offers Reactivate on a deactivated account, without web items or reset", () => {
    const off = user({ status: "deactivated", portalAccess: access({ eligible: false, mobile: false, state: "ineligible" }) });
    assert.deepEqual(rowActions(off, "admin"), ["edit", "reactivate"]);
  });

  it("leaves only Edit on the signed-in admin's own row", () => {
    const self = user({ id: "admin", role: "Admin", portalAccess: access({ web: true, state: "staff" }) });
    assert.deepEqual(rowActions(self, "admin"), ["edit"]);
  });
});

describe("row action items", () => {
  it("keeps the globe control for either saved web access state", () => {
    assert.equal(ROW_ACTION_ITEMS.allowWeb.icon, "globe");
    assert.equal(ROW_ACTION_ITEMS.blockWeb.icon, "globe");
  });

  it("names every action a resident can have, with its own icon", () => {
    const keys = ["edit", "approve", "reject", "deactivate", "reactivate", "resetPassword", "allowWeb", "blockWeb"] as const;
    for (const key of keys) assert.ok(ROW_ACTION_ITEMS[key].label.length > 0, key);
    const onActiveRow = ["edit", "deactivate", "resetPassword", "blockWeb"] as const;
    assert.equal(new Set(onActiveRow.map((key) => ROW_ACTION_ITEMS[key].icon)).size, onActiveRow.length, "no two buttons in a row look alike");
  });
});

describe("column widths", () => {
  it("does not reserve a globe slot when web management is hidden", () => {
    assert.deepEqual(actionWidthsForPermission(false), { block: 4 * 36 + 3 * 4, column: 4 * 36 + 3 * 4 + 2 * 16 });
    assert.deepEqual(actionWidthsForPermission(true), { block: INLINE_ACTIONS_WIDTH, column: COLUMN_WIDTHS.actions });
  });
  // The content beside the sidebar at a 1280px window, less the card's inset and border.
  const TABLE_AT_1280 = 942;
  const { userMin, role, status, access, lastLogin, actions } = COLUMN_WIDTHS;

  it("keeps the table a table at 1280px, not cards, once the role folds under the name", () => {
    assert.ok(userMin + status + access + lastLogin + actions <= TABLE_AT_1280);
    assert.ok(role > 0);
  });

  it("fits the larger text: a full date, the longest status pill, and the portal line", () => {
    assert.ok(lastLogin >= 134);
    assert.ok(access >= 220);
    assert.ok(status >= 160, "Deactivated");
  });

  it("fits the eye and four actions at 36px with their gaps and cell padding", () => {
    assert.equal(INLINE_ACTIONS_WIDTH, 5 * 36 + 4 * 4);
    assert.ok(actions >= INLINE_ACTIONS_WIDTH + 2 * 16);
  });
});
