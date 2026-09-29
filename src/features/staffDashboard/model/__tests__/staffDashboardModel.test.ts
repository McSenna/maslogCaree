import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ALL_SERVICES,
  byQueueTab,
  byService,
  queueTabCounts,
  serviceShares,
  stockIssueOf,
  summarizePeriod,
  urgentWaiting,
} from "../staffDashboardModel.ts";

// 14 days: the first 7 have 1 prenatal each, the last 7 have 2 prenatal and 1 immunisation each.
const trend = Array.from({ length: 14 }, (_, index) => {
  const recent = index >= 7;
  const byService = recent ? { prenatal: 2, immunization: 1 } : { prenatal: 1 };
  return {
    key: `d${index}`,
    label: `D${index}`,
    date: new Date(2026, 8, 16 + index).toISOString(),
    count: Object.values(byService).reduce((sum, n) => sum + n, 0),
    byService,
  };
});

describe("summarizePeriod", () => {
  it("totals the trailing window and compares it with the one before", () => {
    const week = summarizePeriod(trend, "7d");
    assert.equal(week.points.length, 7);
    assert.equal(week.total, 21);
    assert.equal(week.previousTotal, 7);
    assert.equal(week.changePercent, 200);
  });

  it("counts one service when filtered", () => {
    const week = summarizePeriod(trend, "7d", "immunization");
    assert.equal(week.total, 7);
    assert.equal(week.previousTotal, 0);
    assert.equal(week.changePercent, null, "no baseline means no percent change");
    assert.deepEqual(
      week.points.map((point) => point.value),
      [1, 1, 1, 1, 1, 1, 1]
    );
  });

  it("uses whatever history exists when the window is longer than the trend", () => {
    const month = summarizePeriod(trend, "30d", ALL_SERVICES);
    assert.equal(month.points.length, 14);
    assert.equal(month.total, 28);
    assert.equal(month.changePercent, null);
  });
});

describe("serviceShares", () => {
  const services = [
    { key: "immunization", label: "Immunization" },
    { key: "prenatal", label: "Prenatal" },
  ];

  it("sorts services by visits and rounds shares of the period total", () => {
    const shares = serviceShares(trend, "7d", services);
    assert.deepEqual(
      shares.map(({ key, count, percent }) => ({ key, count, percent })),
      [
        { key: "prenatal", count: 14, percent: 67 },
        { key: "immunization", count: 7, percent: 33 },
      ]
    );
  });

  it("reports zero percent rather than dividing by zero", () => {
    const shares = serviceShares([], "7d", services);
    assert.ok(shares.every((share) => share.count === 0 && share.percent === 0));
  });
});

describe("queue filters", () => {
  const queue = [
    { consultationType: "prenatal", status: "confirmed", isUrgent: true },
    { consultationType: "prenatal", status: "processing", isUrgent: false },
    { consultationType: "immunization", status: "rescheduled", isUrgent: false },
    { consultationType: "immunization", status: "completed", isUrgent: true },
  ];

  it("groups confirmed and rescheduled as waiting and processing as in progress", () => {
    assert.deepEqual(queueTabCounts(queue), { all: 4, waiting: 2, in_progress: 1 });
    assert.equal(byQueueTab(queue, "waiting").length, 2);
    assert.equal(byQueueTab(queue, "in_progress")[0].status, "processing");
    assert.equal(byQueueTab(queue, "all").length, 4);
  });

  it("filters by service", () => {
    assert.equal(byService(queue, "prenatal").length, 2);
    assert.equal(byService(queue, ALL_SERVICES).length, 4);
  });

  it("counts urgent patients still in the queue, not ones already seen", () => {
    assert.equal(urgentWaiting(queue), 1);
  });
});

describe("stockIssueOf", () => {
  const now = new Date(2026, 8, 29);
  const inDays = (days: number) => new Date(now.getTime() + days * 86400000).toISOString();

  it("ranks out of stock above low stock above expiring", () => {
    assert.equal(stockIssueOf({ currentStock: 0, reorderLevel: 5, nearestExpiry: inDays(3) }, now), "out");
    assert.equal(stockIssueOf({ currentStock: 5, reorderLevel: 5, nearestExpiry: inDays(3) }, now), "low");
    assert.equal(stockIssueOf({ currentStock: 20, reorderLevel: 5, nearestExpiry: inDays(3) }, now), "expiring");
  });

  it("returns null for healthy stock", () => {
    assert.equal(stockIssueOf({ currentStock: 20, reorderLevel: 5, nearestExpiry: inDays(90) }, now), null);
    assert.equal(stockIssueOf({ currentStock: 20, reorderLevel: 5, nearestExpiry: null }, now), null);
  });
});
