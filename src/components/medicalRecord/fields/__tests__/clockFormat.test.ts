import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { clockFromParts, clockParts, clockToDate, formatClock, isClock, nudgeClock, toClock } from "../clockFormat.ts";

describe("clockFormat", () => {
  it("reads 24-hour values as 12-hour labels, including midnight and noon", () => {
    assert.equal(formatClock("09:30"), "9:30 AM");
    assert.equal(formatClock("00:05"), "12:05 AM");
    assert.equal(formatClock("12:00"), "12:00 PM");
    assert.equal(formatClock("23:59"), "11:59 PM");
  });

  it("keeps a blank blank and an unexpected stored value as it is", () => {
    assert.equal(formatClock(""), "");
    assert.equal(formatClock(undefined), "");
    assert.equal(formatClock("about 9"), "about 9");
  });

  it("round-trips through the picker's Date with no timezone shift", () => {
    assert.equal(toClock(clockToDate("07:45")), "07:45");
    assert.equal(toClock(new Date(2026, 0, 1, 16, 5)), "16:05");
  });

  it("opens on the current time when nothing is set", () => {
    assert.equal(toClock(clockToDate("")), toClock(new Date()));
  });

  it("splits and rebuilds a clock through the picker's 12-hour parts", () => {
    for (const clock of ["00:00", "00:05", "09:32", "12:00", "12:59", "13:01", "23:59"]) {
      assert.equal(clockFromParts(clockParts(clock)), clock);
    }
    assert.deepEqual(clockParts("00:05"), { hour: 12, minute: 5, period: "AM" });
    assert.deepEqual(clockParts("12:30"), { hour: 12, minute: 30, period: "PM" });
  });

  it("carries a nudge into the hour and wraps around midnight", () => {
    assert.equal(nudgeClock("09:59", 1), "10:00");
    assert.equal(nudgeClock("10:00", -1), "09:59");
    assert.equal(nudgeClock("23:59", 1), "00:00");
    assert.equal(nudgeClock("00:00", -1), "23:59");
  });

  it("recognizes only a real clock value", () => {
    assert.equal(isClock("09:30"), true);
    assert.equal(isClock("24:00"), false);
    assert.equal(isClock(""), false);
  });
});
