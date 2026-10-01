import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  appWeekday,
  isCompletionLocked,
  isServiceDay,
  msUntilNextAppDay,
  serviceDayNames,
  serviceDayNote,
} from "../serviceDays.ts";

// Oct 5–11 2026 runs Monday to Sunday; Oct 7 is the Wednesday.
const at = (dateKey: string, time = "09:00") => `${dateKey}T${time}:00+08:00`;

describe("isServiceDay", () => {
  it("allows immunization on Wednesday only", () => {
    const week = ["05", "06", "07", "08", "09", "10", "11"].map((day) => at(`2026-10-${day}`));
    assert.deepEqual(
      week.map((value) => isServiceDay("immunization", value)),
      [false, false, true, false, false, false, false]
    );
  });

  it("leaves every other service open on any day", () => {
    for (const key of ["bp_checking", "prenatal", "general_checkup", "consultation", undefined]) {
      assert.equal(isServiceDay(key, at("2026-10-06")), true, String(key));
    }
  });

  it("reads the barangay's calendar day whatever the device timezone", () => {
    // Manila midnight on Wednesday is still Tuesday in UTC.
    assert.equal(isServiceDay("immunization", "2026-10-06T16:00:00.000Z"), true);
    assert.equal(isServiceDay("immunization", "2026-10-07T15:59:00.000Z"), true);
    assert.equal(isServiceDay("immunization", "2026-10-07T16:00:00.000Z"), false);
  });

  it("treats a date-only mission key as that calendar day", () => {
    assert.equal(appWeekday("2026-10-07"), 3);
    assert.equal(isServiceDay("immunization", "2026-10-07"), true);
    assert.equal(isServiceDay("immunization", "2026-10-08"), false);
  });

  it("never matches an unreadable date", () => {
    assert.equal(isServiceDay("immunization", "not-a-date"), false);
    assert.equal(appWeekday("not-a-date"), null);
  });
});

describe("serviceDayNote", () => {
  it("names the day for fixed-day services only", () => {
    assert.equal(
      serviceDayNote("immunization", "Immunization"),
      "Immunization appointments are available every Wednesday only."
    );
    assert.equal(serviceDayNote("prenatal", "Prenatal"), null);
    assert.equal(serviceDayNote(undefined, ""), null);
  });

  it("exposes the day name for staff-facing copy", () => {
    assert.equal(serviceDayNames("immunization"), "Wednesday");
    assert.equal(serviceDayNames("bp_checking"), null);
  });
});

describe("isCompletionLocked", () => {
  const slot = at("2026-10-07", "09:00");

  it("locks immunization before its scheduled day", () => {
    assert.equal(isCompletionLocked("immunization", slot, new Date(at("2026-10-06", "23:59"))), true);
  });

  it("opens at midnight on the scheduled day, not at the slot time", () => {
    assert.equal(isCompletionLocked("immunization", slot, new Date(at("2026-10-07", "00:00"))), false);
    assert.equal(isCompletionLocked("immunization", slot, new Date(at("2026-10-07", "16:00"))), false);
  });

  it("stays open after the scheduled day", () => {
    assert.equal(isCompletionLocked("immunization", slot, new Date(at("2026-10-08"))), false);
  });

  it("locks an immunization that has no slot", () => {
    assert.equal(isCompletionLocked("immunization", null, new Date(at("2026-10-07"))), true);
  });

  it("never locks other services", () => {
    for (const key of ["bp_checking", "prenatal", "general_checkup", "consultation"]) {
      assert.equal(isCompletionLocked(key, at("2026-10-09"), new Date(at("2026-10-05"))), false, key);
    }
  });
});

describe("msUntilNextAppDay", () => {
  it("counts down to the barangay's next midnight", () => {
    assert.equal(msUntilNextAppDay(new Date(at("2026-10-06", "23:59"))), 60 * 1000);
    assert.equal(msUntilNextAppDay(new Date(at("2026-10-06", "12:00"))), 12 * 60 * 60 * 1000);
  });

  it("waits a full day when called exactly at midnight", () => {
    assert.equal(msUntilNextAppDay(new Date(at("2026-10-07", "00:00"))), 24 * 60 * 60 * 1000);
  });
});
