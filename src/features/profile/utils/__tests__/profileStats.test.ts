import assert from "node:assert/strict";
import { test } from "node:test";
import { statPhrase } from "../profileStats.ts";

const stat = (key: string, label: string, value: number) => ({ key, label, shortLabel: label, value });

test("total and today phrases agree with their count", () => {
  assert.equal(statPhrase(stat("total", "Appointments", 1)), "appointment");
  assert.equal(statPhrase(stat("total", "Appointments", 5)), "appointments");
  assert.equal(statPhrase(stat("today", "Today", 0)), "appointments today");
  assert.equal(statPhrase(stat("today", "Today", 1)), "appointment today");
});

test("other stats fall back to their lowercased label", () => {
  assert.equal(statPhrase(stat("upcoming", "Upcoming", 2)), "upcoming");
  assert.equal(statPhrase(stat("completed", "Completed", 1)), "completed");
});
