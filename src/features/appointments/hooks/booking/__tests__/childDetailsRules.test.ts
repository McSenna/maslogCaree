import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { appTodayKey, validateChildBirthDate, validateChildName, validateWeeklyBooking } from "../childDetailsRules.ts";

describe("validateChildName", () => {
  it("accepts names with spaces, accents, apostrophes and hyphens", () => {
    for (const name of ["Juan Dela Cruz", "María José Peña", "Ana-Marie O'Neil", "Sto. Niño Reyes"]) {
      assert.equal(validateChildName(name), undefined, name);
    }
  });

  it("asks for a name when it is blank", () => {
    assert.ok(validateChildName("   "));
  });

  it("refuses digits, symbols and one-letter names", () => {
    for (const name of ["Child 2", "@juan", "J"]) assert.ok(validateChildName(name), name);
  });
});

describe("validateChildBirthDate", () => {
  it("accepts today and past dates on the barangay calendar", () => {
    assert.equal(validateChildBirthDate("2026-10-01", "2026-10-01"), undefined);
    assert.equal(validateChildBirthDate("2024-01-10", "2026-10-01"), undefined);
  });

  it("refuses a missing, malformed or future date", () => {
    assert.ok(validateChildBirthDate("", "2026-10-01"));
    assert.ok(validateChildBirthDate("10/01/2024", "2026-10-01"));
    assert.ok(validateChildBirthDate("2026-10-02", "2026-10-01"));
  });

  it("uses Philippine time for today", () => {
    assert.equal(appTodayKey(new Date("2026-09-30T17:00:00Z")), "2026-10-01");
    assert.equal(appTodayKey(new Date("2026-09-30T15:59:00Z")), "2026-09-30");
  });
});

describe("validateWeeklyBooking", () => {
  const complete = { serviceType: "immunization", dateKey: "2026-10-07", childName: "Juan Dela Cruz", childDob: "2025-01-10", confirmed: true };

  it("accepts a complete immunization booking with no reason, notes, or time", () => {
    assert.deepEqual(validateWeeklyBooking(complete, "2026-10-01"), {});
  });

  it("flags every missing piece at once", () => {
    const errors = validateWeeklyBooking({ serviceType: "immunization", dateKey: null, childName: "", childDob: "", confirmed: false }, "2026-10-01");
    assert.deepEqual(Object.keys(errors).sort(), ["childDob", "childName", "confirmed", "slot"]);
  });
});
