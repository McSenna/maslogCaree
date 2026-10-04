import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { boundsForField, openingMonth } from "../../../../../components/medicalRecord/fields/dateFieldBounds.ts";
import { clampMonth, isOutside, monthInRange, pastOnly, todayIso, yearOptions } from "../calendarBounds.ts";

const now = new Date(2026, 9, 3);

describe("calendar bounds", () => {
  it("defaults to today and earlier, as birth dates always had", () => {
    const bounds = pastOnly(now);
    assert.equal(bounds.max, "2026-10-03");
    assert.equal(isOutside("2026-10-04", bounds), true);
    assert.equal(isOutside("1990-04-12", bounds), false);
    const years = yearOptions(bounds, now);
    assert.equal(years[0], 2026);
    assert.equal(years.length, 100);
  });
  it("only lets months with an allowed day be shown", () => {
    const bounds = { min: "2026-10-03", max: null };
    assert.equal(monthInRange(2026, 9, bounds), true);
    assert.equal(monthInRange(2026, 8, bounds), false);
    assert.equal(monthInRange(2027, 0, bounds), true);
  });
  it("keeps the month inside the range when the year changes", () => {
    assert.equal(clampMonth(2026, 11, pastOnly(now)), 9);
    assert.equal(clampMonth(2026, 2, { min: "2026-10-03", max: null }), 9);
    assert.equal(clampMonth(2025, 2, pastOnly(now)), 2);
  });
  it("offers a few years ahead when there is no upper limit", () => {
    const years = yearOptions({ min: "2026-10-03", max: null }, now);
    assert.deepEqual([years[0], years.at(-1)], [2031, 2026]);
  });
});

describe("medical date field limits", () => {
  it("a dose given can only be today or earlier", () => {
    assert.deepEqual(boundsForField({ when: "past" }, "2024-03-15", now), { min: null, max: todayIso(now) });
  });
  it("a follow-up starts on the record's visit day, or today for a visit now", () => {
    assert.deepEqual(boundsForField({ when: "after_visit" }, "2024-03-15", now), { min: "2024-03-15", max: null });
    assert.deepEqual(boundsForField({ when: "after_visit" }, null, now), { min: "2026-10-03", max: null });
  });
  it("a field without a rule takes any day", () => {
    assert.deepEqual(boundsForField({}, "2024-03-15", now), { min: null, max: null });
  });
  it("an empty picker opens on this month, or later when the range starts later", () => {
    assert.deepEqual(openingMonth({ min: "2024-03-15", max: null }, now), { year: 2026, monthIndex: 9 });
    assert.deepEqual(openingMonth({ min: "2027-02-01", max: null }, now), { year: 2027, monthIndex: 1 });
  });
});
