import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (path: string) => readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8");

// kape asked for every action to be on the row, so no table hides one behind a menu (2026-11-03).
describe("every action is on the row", () => {
  it("the user accounts rows have no menu, on any tab", () => {
    const actions = read("features/users/admin/components/shared/UserRowActions.tsx");
    assert.doesNotMatch(actions, /RowMenuButton|inline/);
    assert.equal(existsSync(new URL("../admin/components/shared/RowActionMenu.tsx", import.meta.url)), false);
  });

  it("the appointment rows have no More actions button", () => {
    const actions = read("components/appointmentQueue/appointmentsPanel/RowActions.tsx");
    assert.doesNotMatch(actions, /more-horizontal|More actions/);
    assert.match(actions, /label="Reschedule"/);
  });

  it("the phone announcement rows keep Edit and Delete outside the expanded details", () => {
    const row = read("features/announcements/admin/components/phone/PhoneAnnouncementRow.tsx");
    assert.doesNotMatch(row, /more-vertical|More actions/);
    assert.ok(row.indexOf('label="Edit"') > row.indexOf("{expanded ?") && row.indexOf('label="Edit"') > row.lastIndexOf(") : null}", row.indexOf('label="Edit"')), "Edit is after the expanded block closes");
  });
});
