import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ANNOUNCEMENT_LIMITS,
  announcementDateRange,
  combineDateTime,
  hasAnnouncementErrors,
  mapServerFieldErrors,
  parseClock,
  parseDateKey,
  toCreatePayload,
  validateAnnouncementForm,
} from "../announcementRules.ts";

// A fixed "now": Wednesday 1 July 2026, 10:30 local time.
const NOW = new Date(2026, 6, 1, 10, 30);

const valid = () => ({
  title: "Free vaccination drive",
  message: "Bring your child's immunization card.",
  date: "2026-07-04",
  time: "09:00",
  location: "Barangay Maslog Health Center",
});

describe("date and time parsing", () => {
  it("accepts real calendar days only", () => {
    assert.ok(parseDateKey("2028-02-29"));
    assert.equal(parseDateKey("2027-02-29"), null);
    assert.equal(parseDateKey("2026-13-01"), null);
    assert.equal(parseDateKey("2026-7-4"), null);
    assert.equal(parseDateKey(""), null);
  });

  it("accepts 24-hour clock times only", () => {
    assert.equal(parseClock("00:00"), 0);
    assert.equal(parseClock("23:59"), 23 * 60 + 59);
    assert.equal(parseClock("24:00"), null);
    assert.equal(parseClock("9:00"), null);
  });

  it("combines local date and time into one instant", () => {
    const combined = combineDateTime("2026-07-04", "14:05");
    assert.ok(combined);
    assert.deepEqual(
      [combined.getFullYear(), combined.getMonth(), combined.getDate(), combined.getHours(), combined.getMinutes()],
      [2026, 6, 4, 14, 5]
    );
    assert.equal(combineDateTime("2026-07-04", ""), null);
  });

  it("offers today through the horizon in the picker", () => {
    assert.deepEqual(announcementDateRange(NOW), { min: "2026-07-01", max: "2027-07-01" });
  });
});

describe("validateAnnouncementForm", () => {
  it("passes a complete form", () => {
    assert.deepEqual(validateAnnouncementForm(valid(), NOW), {});
  });

  it("flags every missing field at once", () => {
    const errors = validateAnnouncementForm(
      { title: "", message: " ", date: "", time: "", location: "" },
      NOW
    );
    assert.deepEqual(Object.keys(errors).sort(), ["date", "location", "message", "time", "title"]);
    assert.equal(errors.message, "Message is required.");
    assert.ok(hasAnnouncementErrors(errors));
  });

  it("enforces length limits on trimmed text", () => {
    const errors = validateAnnouncementForm(
      { ...valid(), title: "  Hi  ", location: "x".repeat(ANNOUNCEMENT_LIMITS.locationMax + 1) },
      NOW
    );
    assert.match(errors.title ?? "", /at least 5/);
    assert.match(errors.location ?? "", /must not exceed 160/);
  });

  it("rejects past days but allows later today", () => {
    assert.equal(
      validateAnnouncementForm({ ...valid(), date: "2026-06-30" }, NOW).date,
      "The date cannot be in the past."
    );
    assert.deepEqual(validateAnnouncementForm({ ...valid(), date: "2026-07-01", time: "08:00" }, NOW), {});
  });

  it("rejects dates beyond the horizon", () => {
    assert.match(validateAnnouncementForm({ ...valid(), date: "2027-07-03" }, NOW).date ?? "", /within the next 365/);
  });

  it("rejects malformed date and time values", () => {
    const errors = validateAnnouncementForm({ ...valid(), date: "2026-02-30", time: "25:00" }, NOW);
    assert.equal(errors.date, "Enter a valid date.");
    assert.equal(errors.time, "Enter a valid time.");
  });
});

describe("payload and server errors", () => {
  it("trims text and sends the combined instant as ISO", () => {
    const payload = toCreatePayload({ ...valid(), title: "  Free vaccination drive " });
    assert.equal(payload.title, "Free vaccination drive");
    assert.equal(payload.eventAt, new Date(2026, 6, 4, 9, 0).toISOString());
  });

  it("maps the API's eventAt error onto the date field", () => {
    assert.deepEqual(
      mapServerFieldErrors({ eventAt: "The date cannot be in the past.", title: "Title is required.", extra: "x" }),
      { date: "The date cannot be in the past.", title: "Title is required." }
    );
  });
});
