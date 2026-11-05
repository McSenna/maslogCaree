import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { errorsAfterBlur, firstInvalidField, hasUnsavedChanges } from "../announcementFormChecks.ts";
import { toApiPayload, toSubmitPayload } from "../announcementSubmit.ts";

// A fixed "now": Wednesday 1 July 2026, 10:30 local time.
const NOW = new Date(2026, 6, 1, 10, 30);

const valid = () => ({
  title: "Free vaccination drive",
  message: "Bring your child's immunization card.",
  date: "2026-07-04",
  time: "09:00",
  location: "Barangay Maslog Health Center",
  audience: "Everyone" as const,
  endDate: "",
  isDraft: false,
});

describe("submit payload", () => {
  it("trims text, lowercases the audience and sends the local instant as ISO", () => {
    const payload = toSubmitPayload({ ...valid(), title: "  Free vaccination drive ", audience: "Patients" }, false);
    assert.deepEqual(payload, {
      title: "Free vaccination drive",
      message: "Bring your child's immunization card.",
      location: "Barangay Maslog Health Center",
      audience: "patients",
      scheduledAt: new Date(2026, 6, 4, 9, 0).toISOString(),
      showUntil: null,
      isDraft: false,
    });
  });

  it("keeps show until as a plain date and records the chosen action", () => {
    const payload = toSubmitPayload({ ...valid(), endDate: "2026-07-10" }, true);
    assert.equal(payload.showUntil, "2026-07-10");
    assert.equal(payload.isDraft, true);
  });

  it("refuses to build a payload without a valid date and time", () => {
    assert.throws(() => toSubmitPayload({ ...valid(), time: "" }, false));
  });
});

describe("API payload", () => {
  it("maps the submit payload onto the API's field names", () => {
    const api = toApiPayload(toSubmitPayload({ ...valid(), audience: "Staff" }, false));
    assert.equal(api.eventAt, new Date(2026, 6, 4, 9, 0).toISOString());
    assert.equal(api.audience, "Staff");
    assert.equal(api.expiresAt, null);
    assert.equal(api.location, "Barangay Maslog Health Center");
    assert.equal(api.isDraft, false);
  });

  it("keeps an announcement up through its whole end day", () => {
    const api = toApiPayload(toSubmitPayload({ ...valid(), endDate: "2026-07-10" }, false));
    assert.equal(api.expiresAt, new Date(2026, 6, 10, 23, 59).toISOString());
  });
});

describe("unsaved changes", () => {
  it("is false until something differs from the starting values", () => {
    assert.equal(hasUnsavedChanges(valid(), valid()), false);
    assert.equal(hasUnsavedChanges({ ...valid(), title: "Changed" }, valid()), true);
    assert.equal(hasUnsavedChanges({ ...valid(), audience: "Staff" }, valid()), true);
  });
});

describe("first invalid field", () => {
  it("follows the order the fields appear in, not the order errors arrive", () => {
    assert.equal(firstInvalidField({ time: "x", endDate: "y" }), "time");
    assert.equal(firstInvalidField({ date: "x", location: "y", title: "z" }), "title");
    assert.equal(firstInvalidField({}), null);
  });
});

describe("validation on blur", () => {
  const empty = { ...valid(), title: "", message: "", date: "", time: "", location: "" };

  it("marks only the field that was left, not the rest of the form", () => {
    assert.deepEqual(errorsAfterBlur("title", empty, {}, NOW), { title: "Title is required." });
  });

  it("clears a field's error once it is valid and leaves other errors alone", () => {
    const current = { title: "Title is required.", message: "Message is required." };
    assert.deepEqual(errorsAfterBlur("title", { ...empty, title: "Free vaccination drive" }, current, NOW), {
      message: "Message is required.",
    });
  });

  it("rechecks a filled time and end date when the date changes, but not an empty time", () => {
    const earlierEnd = { ...valid(), date: "2026-07-04", endDate: "2026-07-03" };
    assert.equal(errorsAfterBlur("date", earlierEnd, {}, NOW).endDate, "The end date cannot be before the event.");
    const today = { ...valid(), date: "2026-07-01", time: "08:00" };
    assert.equal(errorsAfterBlur("date", today, {}, NOW).time, "That time has already passed. Choose a later time.");
    assert.equal(errorsAfterBlur("date", { ...valid(), time: "" }, {}, NOW).time, undefined);
  });
});
