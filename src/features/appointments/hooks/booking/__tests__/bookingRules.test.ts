import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  classifyBookingFailure,
  classifyWeeklyFailure,
  createBookingRequestKey,
  keepOpenDay,
  keepOpenSelection,
  validateBooking,
} from "../bookingRules.ts";

const schedule = (id: string, starts: string[]) => ({ missionScheduleId: id, availableSlotStarts: starts });

const complete = {
  serviceType: "general_checkup",
  scheduleId: "m1",
  slotStart: "2026-10-08T00:00:00.000Z",
  reason: "Cough",
  confirmed: true,
};

describe("validateBooking", () => {
  it("accepts a complete booking", () => {
    assert.deepEqual(validateBooking(complete), {});
  });

  it("asks for a date and time before booking", () => {
    assert.ok(validateBooking({ ...complete, scheduleId: null, slotStart: null }).slot);
    assert.ok(validateBooking({ ...complete, slotStart: null }).slot);
  });

  it("flags every missing field at once", () => {
    const errors = validateBooking({
      serviceType: null,
      scheduleId: null,
      slotStart: null,
      reason: "   ",
      confirmed: false,
    });
    assert.deepEqual(Object.keys(errors).sort(), ["confirmed", "reason", "serviceType", "slot"]);
  });
});

describe("createBookingRequestKey", () => {
  it("matches the server's accepted key format", () => {
    for (let i = 0; i < 50; i += 1) {
      assert.match(createBookingRequestKey(), /^[A-Za-z0-9_-]{8,64}$/);
    }
  });

  it("gives separate attempts separate keys", () => {
    const keys = new Set(Array.from({ length: 200 }, () => createBookingRequestKey()));
    assert.equal(keys.size, 200);
  });
});

describe("keepOpenSelection", () => {
  const schedules = [schedule("m1", ["a", "b"]), schedule("m2", [])];

  it("keeps a choice that is still open after a reload", () => {
    assert.deepEqual(keepOpenSelection(schedules, "m1", "b"), { scheduleId: "m1", slotStart: "b" });
  });

  it("keeps the date but clears a time someone else took", () => {
    assert.deepEqual(keepOpenSelection(schedules, "m1", "c"), { scheduleId: "m1", slotStart: null });
  });

  it("moves to the first date with open times when the chosen date is gone or full", () => {
    assert.deepEqual(keepOpenSelection(schedules, "gone", "a"), { scheduleId: "m1", slotStart: null });
    assert.deepEqual(keepOpenSelection(schedules, "m2", null), { scheduleId: "m1", slotStart: null });
  });

  it("selects nothing when no date has open times", () => {
    assert.deepEqual(keepOpenSelection([schedule("m2", [])], null, null), { scheduleId: null, slotStart: null });
  });
});

describe("classifyBookingFailure", () => {
  it("sends a taken slot back to a reloaded list of times", () => {
    assert.equal(classifyBookingFailure({ code: "SLOT_UNAVAILABLE", status: 409 }), "slot_unavailable");
  });

  it("recognises an existing booking for the same service and day", () => {
    assert.equal(classifyBookingFailure({ code: "DUPLICATE_BOOKING", status: 409 }), "duplicate");
  });

  it("treats a dropped connection as safe to retry", () => {
    assert.equal(classifyBookingFailure({ code: "NETWORK_ERROR", isNetworkError: true }), "connection");
    assert.equal(classifyBookingFailure({ code: "TIMEOUT_ERROR", isTimeoutError: true }), "connection");
    assert.equal(classifyBookingFailure({ code: "SERVICE_UNAVAILABLE", status: 503 }), "connection");
  });

  it("treats any refused time as a stale list, and anything else as a plain error", () => {
    assert.equal(classifyBookingFailure({ code: "VALIDATION_ERROR", status: 400 }), "slot_unavailable");
    assert.equal(classifyBookingFailure({ code: "MISSING_FIELDS", status: 400 }), "other");
    assert.equal(classifyBookingFailure({ code: "FORBIDDEN", status: 403 }), "other");
  });
});

describe("classifyWeeklyFailure", () => {
  it("only a full day is a refused time", () => {
    assert.equal(classifyWeeklyFailure({ code: "SLOT_UNAVAILABLE", status: 409 }), "slot_unavailable");
    assert.equal(classifyWeeklyFailure({ code: "VALIDATION_ERROR", status: 400 }), "other");
  });

  it("keeps the shared handling for duplicates and dropped connections", () => {
    assert.equal(classifyWeeklyFailure({ code: "DUPLICATE_BOOKING", status: 409 }), "duplicate");
    assert.equal(classifyWeeklyFailure({ code: "NETWORK_ERROR", isNetworkError: true }), "connection");
  });
});

describe("keepOpenDay", () => {
  const days = [
    { dateKey: "2026-10-08", openPositions: 0 },
    { dateKey: "2026-10-15", openPositions: 3 },
    { dateKey: "2026-10-22", openPositions: 24 },
  ];

  it("preselects the earliest Thursday that still has room", () => {
    assert.equal(keepOpenDay(days, null), "2026-10-15");
  });

  it("keeps a chosen day with room and moves off one that filled up", () => {
    assert.equal(keepOpenDay(days, "2026-10-22"), "2026-10-22");
    assert.equal(keepOpenDay(days, "2026-10-08"), "2026-10-15");
  });

  it("selects nothing when every day is full", () => {
    assert.equal(keepOpenDay([{ dateKey: "2026-10-08", openPositions: 0 }], null), null);
  });
});
