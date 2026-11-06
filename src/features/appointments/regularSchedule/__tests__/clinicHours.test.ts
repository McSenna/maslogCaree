import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { RegularSchedule } from "@/types/appointments.types";

import { clinicHoursRows } from "../clinicHours.ts";

const FULL = [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "16:00" }];
const BP: RegularSchedule = {
  timeZone: "Asia/Manila",
  intervalMinutes: 10,
  today: "2026-11-07",
  weekdays: [1, 2, 3, 4, 5].map((weekday) => ({ weekday, windows: FULL })).concat({ weekday: 6, windows: [FULL[0]] }),
  bookingHorizonWeeks: null,
  lastBookableDate: null,
};

describe("clinic hours sidebar", () => {
  it("matches the booking design rows", () => {
    assert.deepEqual(
      clinicHoursRows(BP).map(({ label, lines }) => [label, lines]),
      [
        ["Mon–Fri", ["8:00 AM – 12:00 PM", "1:00 PM – 4:00 PM"]],
        ["Saturday", ["8:00 AM – 12:00 PM", "Half day"]],
        ["Lunch break", ["12:00 PM – 1:00 PM", "No appointments"]],
        ["Sunday", ["Closed"]],
      ]
    );
  });

  it("gives screen readers words instead of dashes", () => {
    const spoken = clinicHoursRows(BP).map((row) => row.spoken);
    assert.equal(spoken[0], "Monday to Friday, 8:00 AM to 12:00 PM and 1:00 PM to 4:00 PM");
    assert.equal(spoken[1], "Saturday, 8:00 AM to 12:00 PM, half day");
    assert.equal(spoken[3], "Sunday, closed");
    assert.ok(spoken.every((line) => !line.includes("–")));
  });

  it("follows the config when hours change", () => {
    const oneDay: RegularSchedule = { ...BP, weekdays: [{ weekday: 4, windows: [FULL[0]] }] };
    assert.deepEqual(clinicHoursRows(oneDay).map((row) => row.label), ["Thursday", "Sunday, Monday, Tuesday, Wednesday, Friday, Saturday"]);
  });
});
