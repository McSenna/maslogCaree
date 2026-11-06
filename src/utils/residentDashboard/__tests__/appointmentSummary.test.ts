import assert from "node:assert/strict";
import { test } from "node:test";

import { monthlyVisitBars } from "../appointmentSummary.ts";

type Row = Parameters<typeof monthlyVisitBars>[0][number];

const row = (status: Row["status"], slotStart: string | null, createdAt = "2026-01-01T00:00:00.000Z"): Row =>
  ({ status, slotStart, createdAt }) as Row;

const NOW = new Date(2026, 10, 6, 10, 0);

test("covers the last six months, oldest first, ending with this month", () => {
  const bars = monthlyVisitBars([], "blue", NOW);
  assert.deepEqual(bars.map((bar) => bar.label), ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]);
  assert.ok(bars.every((bar) => bar.value === 0 && bar.color === "blue"));
});

test("cancelled and declined requests are not counted as visits", () => {
  const bars = monthlyVisitBars(
    [
      row("completed", new Date(2026, 10, 3, 9).toISOString()),
      row("confirmed", new Date(2026, 10, 20, 9).toISOString()),
      row("cancelled", new Date(2026, 10, 4, 9).toISOString()),
      row("declined", null, new Date(2026, 10, 2).toISOString()),
    ],
    "blue",
    NOW
  );
  assert.equal(bars.at(-1)?.value, 2);
});

test("a request with no slot yet counts in the month it was made", () => {
  const bars = monthlyVisitBars([row("pending", null, new Date(2026, 9, 15).toISOString())], "blue", NOW);
  assert.equal(bars.find((bar) => bar.label === "Oct")?.value, 1);
});

test("the same month of an earlier year is not counted", () => {
  const bars = monthlyVisitBars([row("completed", new Date(2025, 10, 3).toISOString())], "blue", NOW);
  assert.equal(bars.at(-1)?.value, 0);
});
