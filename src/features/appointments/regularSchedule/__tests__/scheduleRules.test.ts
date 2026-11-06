import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { RegularDay, RegularSchedule, RegularSlot } from "@/types/appointments.types";

import { breakTextOn, slotEndTime, formatClock, formatDateKey, monthLabel, scheduleLines, shiftMonth, weekdayOfKey } from "../scheduleFormat.ts";
import {
  buildMonthCells,
  canGoToNextMonth,
  canGoToPreviousMonth,
  dayAccessibilityLabel,
  groupSlots,
  keepSlot,
  noSlotsMessage,
  readRegularOptions,
  selectionText,
  timeFieldText,
} from "../scheduleRules.ts";

// The BP schedule exactly as the server sends it (Saturday 8 to 12 is an assumption).
const FULL = [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "16:00" }];
const BP_SCHEDULE: RegularSchedule = {
  timeZone: "Asia/Manila",
  intervalMinutes: 10,
  today: "2026-11-06",
  weekdays: [1, 2, 3, 4, 5].map((weekday) => ({ weekday, windows: FULL })).concat({ weekday: 6, windows: [FULL[0]] }),
  bookingHorizonWeeks: null,
  lastBookableDate: null,
};

const slot = (time: string): RegularSlot => ({
  start: `2026-11-09T${time}:00+08:00`,
  end: `2026-11-09T${time}:10+08:00`,
  time,
  period: Number(time.slice(0, 2)) < 12 ? "morning" : "afternoon",
});

describe("regular schedule formatting", () => {
  it("formats wall-clock times without the device timezone", () => {
    assert.equal(formatClock("08:00"), "8:00 AM");
    assert.equal(formatClock("11:50"), "11:50 AM");
    assert.equal(formatClock("12:00"), "12:00 PM");
    assert.equal(formatClock("13:00"), "1:00 PM");
    assert.equal(formatClock("15:50"), "3:50 PM");
  });

  it("reads dates from their keys", () => {
    assert.equal(weekdayOfKey("2026-11-09"), 1);
    assert.equal(weekdayOfKey("2026-11-15"), 0);
    assert.equal(formatDateKey("2026-11-09"), "Monday, November 9, 2026");
    assert.equal(formatDateKey("2026-11-14", true), "Sat, Nov 14");
  });

  it("moves between months across a year end", () => {
    assert.equal(shiftMonth("2026-12", 1), "2027-01");
    assert.equal(shiftMonth("2026-01", -1), "2025-12");
    assert.equal(monthLabel("2026-11"), "November 2026");
  });

  it("explains the hours, Saturday half day, lunch break, and Sunday closure", () => {
    assert.deepEqual(scheduleLines(BP_SCHEDULE), [
      { label: "Monday to Friday", value: "8:00 AM to 12:00 PM and 1:00 PM to 4:00 PM" },
      { label: "Saturday (half day)", value: "8:00 AM to 12:00 PM" },
      { label: "Lunch break", value: "12:00 PM to 1:00 PM, no appointments" },
      { label: "Sunday", value: "Closed" },
    ]);
  });

  it("names the lunch break only on days that have one", () => {
    assert.equal(breakTextOn(BP_SCHEDULE, "2026-11-09"), "12:00 PM to 1:00 PM");
    assert.equal(breakTextOn(BP_SCHEDULE, "2026-11-14"), null, "Saturday is a half day");
    assert.equal(breakTextOn(BP_SCHEDULE, "2026-11-15"), null, "Sunday is closed");
  });
});

describe("regular schedule calendar", () => {
  const days: RegularDay[] = [
    { dateKey: "2026-11-05", status: "past", openSlots: 0, totalSlots: 42 },
    { dateKey: "2026-11-06", status: "ended", openSlots: 0, totalSlots: 42 },
    { dateKey: "2026-11-07", status: "open", openSlots: 3, totalSlots: 24 },
    { dateKey: "2026-11-08", status: "closed", openSlots: 0, totalSlots: 0 },
    { dateKey: "2026-11-09", status: "full", openSlots: 0, totalSlots: 42 },
  ];
  const cells = buildMonthCells("2026-11", days);
  const cellFor = (dateKey: string) => cells.find((cell) => cell.kind === "day" && cell.dateKey === dateKey);

  it("starts the month on its weekday and lists every day", () => {
    assert.equal(cells.filter((cell) => cell.kind === "blank").length, 0, "November 2026 starts on a Sunday");
    assert.equal(cells.filter((cell) => cell.kind === "day").length, 30);
    assert.equal(buildMonthCells("2026-12", []).filter((cell) => cell.kind === "blank").length, 2);
  });

  it("lets only open days be chosen", () => {
    for (const key of ["2026-11-05", "2026-11-06", "2026-11-08", "2026-11-09"]) {
      const cell = cellFor(key);
      assert.ok(cell?.kind === "day" && !cell.selectable, key);
    }
    const open = cellFor("2026-11-07");
    assert.ok(open?.kind === "day" && open.selectable);
  });

  it("treats a day the server left out as closed", () => {
    const missing = cellFor("2026-11-20");
    assert.ok(missing?.kind === "day" && missing.status === "closed" && !missing.selectable);
  });

  it("says the full date and state to screen readers", () => {
    assert.equal(dayAccessibilityLabel({ dateKey: "2026-11-07", status: "open", openSlots: 3 }, true, false), "Saturday, November 7, 2026, 3 open times, selected");
    assert.equal(dayAccessibilityLabel({ dateKey: "2026-11-06", status: "ended", openSlots: 0 }, false, true), "Friday, November 6, 2026, today, no times left today");
    assert.equal(dayAccessibilityLabel({ dateKey: "2026-11-08", status: "closed", openSlots: 0 }, false, false), "Sunday, November 8, 2026, closed");
  });

  it("never goes back before the current month", () => {
    assert.equal(canGoToPreviousMonth("2026-11", "2026-11-06"), false);
    assert.equal(canGoToPreviousMonth("2026-12", "2026-11-06"), true);
  });

  it("goes forward without limit unless a horizon is set", () => {
    assert.equal(canGoToNextMonth("2030-01", null), true);
    assert.equal(canGoToNextMonth("2026-12", "2026-12-31"), false);
    assert.equal(canGoToNextMonth("2026-11", "2026-12-31"), true);
  });
});

describe("regular schedule times", () => {
  it("groups morning and afternoon around lunch", () => {
    const groups = groupSlots([slot("08:00"), slot("11:50"), slot("13:00")]);
    assert.deepEqual(groups.map((group) => [group.label, group.slots.length]), [["Morning", 2], ["Afternoon", 1]]);
    assert.deepEqual(groupSlots([slot("09:00")]).map((group) => group.label), ["Morning"]);
  });

  it("clears a chosen time the new date does not offer", () => {
    assert.equal(keepSlot([slot("08:00")], slot("08:00").start), slot("08:00").start);
    assert.equal(keepSlot([slot("08:10")], slot("08:00").start), null);
    assert.equal(keepSlot(undefined, slot("08:00").start), null);
    assert.equal(keepSlot([slot("08:00")], null), null);
  });

  it("ends a slot on the same wall clock", () => {
    assert.equal(slotEndTime({ start: "2026-11-09T03:50:00.000Z", end: "2026-11-09T04:00:00.000Z", time: "11:50" }), "12:00");
    assert.equal(slotEndTime({ start: "2026-11-09T07:50:00.000Z", end: "2026-11-09T08:00:00.000Z", time: "15:50" }), "16:00");
  });

  it("names the selection the way the summary shows it", () => {
    assert.equal(selectionText("2026-11-09", slot("13:20")), "Monday, November 9, 2026 at 1:20 PM");
  });

  it("explains every empty day", () => {
    assert.match(noSlotsMessage("full", "BP Checking"), /booked/);
    assert.match(noSlotsMessage("ended", "BP Checking"), /passed/);
    assert.match(noSlotsMessage("closed", "BP Checking"), /BP Checking is closed/);
  });

  it("rejects a response that is not a regular schedule", () => {
    assert.equal(readRegularOptions({ scheduling: "mission", schedules: [] }), null);
    assert.equal(readRegularOptions(null), null);
    const read = readRegularOptions({ scheduling: "regular", schedule: BP_SCHEDULE, month: { monthKey: "2026-11", days: [] }, day: null });
    assert.equal(read?.month.monthKey, "2026-11");
  });

  it("keeps the Time box closed until a date is chosen", () => {
    assert.deepEqual(timeFieldText({ dateKey: null, dayLoading: false, day: null, selectedSlot: null }), { value: null, placeholder: "Choose a date first", disabled: true });
    assert.equal(timeFieldText({ dateKey: "2026-11-09", dayLoading: true, day: null, selectedSlot: null }).placeholder, "Checking open times...");
    assert.equal(timeFieldText({ dateKey: "2026-11-09", dayLoading: false, day: { slots: [] }, selectedSlot: null }).placeholder, "No open times on this date");
    assert.equal(timeFieldText({ dateKey: "2026-11-09", dayLoading: false, day: { slots: [slot("08:20")] }, selectedSlot: null }).placeholder, "Choose a time");
  });

  it("shows the chosen time as a range in the Time box", () => {
    const chosen = { start: "2026-11-09T00:20:00.000Z", end: "2026-11-09T00:30:00.000Z", time: "08:20", period: "morning" as const };
    assert.equal(timeFieldText({ dateKey: "2026-11-09", dayLoading: false, day: { slots: [chosen] }, selectedSlot: chosen }).value, "8:20 AM to 8:30 AM");
  });
});
