import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { appointmentsFor, tabOf } from "../appointmentTabs.ts";

const now = new Date(2026, 8, 29, 10, 0);
const at = (day: number, hour = 9) => new Date(2026, 8, day, hour).toISOString();

describe("tabOf", () => {
  it("keeps open appointments from today onward as upcoming, including earlier today", () => {
    assert.equal(tabOf({ status: "confirmed", slotStart: at(29, 8) }, now), "upcoming");
    assert.equal(tabOf({ status: "rescheduled", slotStart: at(30) }, now), "upcoming");
    assert.equal(tabOf({ status: "processing", slotStart: at(29, 9) }, now), "upcoming");
  });

  it("treats requests without a slot as upcoming", () => {
    assert.equal(tabOf({ status: "pending", slotStart: null }, now), "upcoming");
  });

  it("moves closed appointments and open ones from before today to past", () => {
    assert.equal(tabOf({ status: "completed", slotStart: at(30) }, now), "past");
    assert.equal(tabOf({ status: "declined", slotStart: null }, now), "past");
    assert.equal(tabOf({ status: "cancelled", slotStart: at(30) }, now), "past");
    assert.equal(tabOf({ status: "confirmed", slotStart: at(28) }, now), "past");
  });
});

describe("appointmentsFor", () => {
  const list = [
    { id: "a", status: "pending", slotStart: null, createdAt: at(20) },
    { id: "b", status: "confirmed", slotStart: at(31) },
    { id: "c", status: "confirmed", slotStart: at(30) },
    { id: "d", status: "completed", slotStart: at(10) },
    { id: "e", status: "declined", slotStart: null, createdAt: at(25) },
  ];

  it("orders upcoming soonest first with unscheduled requests last", () => {
    assert.deepEqual(
      appointmentsFor(list, "upcoming", now).map((row) => row.id),
      ["c", "b", "a"]
    );
  });

  it("orders past newest first, using the request date when there was no slot", () => {
    assert.deepEqual(
      appointmentsFor(list, "past", now).map((row) => row.id),
      ["e", "d"]
    );
  });

  it("does not reorder the caller's array", () => {
    const copy = [...list];
    appointmentsFor(list, "upcoming", now);
    assert.deepEqual(list, copy);
  });
});
