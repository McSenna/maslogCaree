import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { describeEventTiming, groupAnnouncementsByTiming } from "../announcementTiming.ts";

const NOW = new Date(2026, 9, 1, 10, 0);
const at = (days: number, hour = 9) => new Date(2026, 9, 1 + days, hour, 0).toISOString();

describe("describeEventTiming", () => {
  it("counts calendar days, not 24-hour spans", () => {
    assert.deepEqual(describeEventTiming(at(0, 23), NOW), { label: "Today", past: false });
    assert.deepEqual(describeEventTiming(at(1, 8), NOW), { label: "Tomorrow", past: false });
    assert.deepEqual(describeEventTiming(at(5), NOW), { label: "In 5 days", past: false });
  });

  it("switches to weeks, then stops naming far-off dates", () => {
    assert.deepEqual(describeEventTiming(at(21), NOW), { label: "In 3 weeks", past: false });
    assert.equal(describeEventTiming(at(90), NOW), null);
  });

  it("marks anything before now as past, even earlier today", () => {
    assert.deepEqual(describeEventTiming(at(0, 9), NOW), { label: "Past event", past: true });
  });

  it("ignores dates it cannot read", () => {
    assert.equal(describeEventTiming("not a date", NOW), null);
  });
});

describe("groupAnnouncementsByTiming", () => {
  it("puts the soonest upcoming first and the latest past first", () => {
    const items = [
      { id: "far", eventAt: at(20) },
      { id: "old", eventAt: at(-30) },
      { id: "soon", eventAt: at(2) },
      { id: "recent", eventAt: at(-2) },
    ];
    const { upcoming, past } = groupAnnouncementsByTiming(items, NOW);
    assert.deepEqual(upcoming.map((item) => item.id), ["soon", "far"]);
    assert.deepEqual(past.map((item) => item.id), ["recent", "old"]);
  });
});
