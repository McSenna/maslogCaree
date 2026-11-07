import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  classifyBookingFailure,
  classifyQueuedFailure,
  classifyWeeklyFailure,
  createBookingRequestKey,
  hasBookingInput,
  keepOpenDay,
  validateQueuedBooking,
} from "../bookingRules.ts";

const complete = { serviceType: "general_checkup", reason: "Cough", confirmed: true };

describe("validateQueuedBooking", () => {
  it("accepts a request with no date or time: the queue assigns them", () => {
    assert.deepEqual(validateQueuedBooking(complete), {});
  });

  it("never asks a queued request for a slot", () => {
    assert.equal(validateQueuedBooking({ ...complete, reason: "" }).slot, undefined);
  });

  it("flags every missing field at once", () => {
    const errors = validateQueuedBooking({ serviceType: null, reason: "   ", confirmed: false });
    assert.deepEqual(Object.keys(errors).sort(), ["confirmed", "reason", "serviceType"]);
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

describe("classifyQueuedFailure", () => {
  it("never treats a refusal as a stale time list, since no time was picked", () => {
    assert.equal(classifyQueuedFailure({ code: "SLOT_UNAVAILABLE", status: 409 }), "other");
    assert.equal(classifyQueuedFailure({ code: "VALIDATION_ERROR", status: 400 }), "other");
  });

  it("keeps the shared handling for dropped connections", () => {
    assert.equal(classifyQueuedFailure({ code: "NETWORK_ERROR", isNetworkError: true }), "connection");
    assert.equal(classifyQueuedFailure({ code: "SERVICE_UNAVAILABLE", status: 503 }), "connection");
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

describe("hasBookingInput", () => {
  const empty = {
    serviceType: null,
    slotStart: null,
    dateKey: null,
    reason: "",
    notes: "",
    childName: "",
    childDob: "",
    confirmed: false,
  };

  it("has nothing to lose on an untouched form, so closing asks nothing", () => {
    assert.equal(hasBookingInput(empty), false);
    assert.equal(hasBookingInput({ ...empty, reason: "   " }), false);
  });

  it("protects any single choice or typed field", () => {
    for (const change of [
      { serviceType: "bp_checking" },
      { slotStart: "2026-10-08T00:00:00.000Z" },
      { dateKey: "2026-10-08" },
      { reason: "Cough" },
      { notes: "Morning" },
      { childName: "Fixture" },
      { childDob: "2026-01-01" },
      { confirmed: true },
    ]) {
      assert.equal(hasBookingInput({ ...empty, ...change }), true, JSON.stringify(change));
    }
  });
});
