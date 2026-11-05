import assert from "node:assert/strict";
import { test } from "node:test";

import { MOCK_RECORD } from "../mock.ts";
import {
  AGE_SLOTS,
  babyMeta,
  doseAt,
  doseSpokenLabel,
  formatRecordDate,
  motherMeta,
  nextTab,
  progressOf,
  truncateMiddle,
} from "../recordModel.ts";
import type { Vaccine } from "../types.ts";

const vaccine = (statuses: ("completed" | "pending")[]): Vaccine => ({
  id: "test",
  name: "Test vaccine",
  doses: statuses.map((status, index) => ({ slot: AGE_SLOTS[index].key, label: `Dose ${index + 1}`, status })),
});

test("progress is derived from the sample record, not typed in", () => {
  const progress = progressOf(MOCK_RECORD.vaccines);
  assert.equal(progress.completed, 2);
  assert.equal(progress.total, 15);
  assert.equal(progress.summary, "2 of 15 doses recorded");
  assert.equal(progress.statusLabel, "In progress");
});

test("progress status follows the counts at both ends", () => {
  assert.equal(progressOf([vaccine(["pending", "pending"])]).statusLabel, "Not started");
  assert.equal(progressOf([vaccine(["completed", "completed"])]).statusLabel, "Complete");
  assert.equal(progressOf([vaccine(["completed", "pending"])]).statusLabel, "In progress");
});

test("a record with no doses reads as not started, never complete", () => {
  const progress = progressOf([]);
  assert.equal(progress.statusLabel, "Not started");
  assert.equal(progress.summary, "0 of 0 doses recorded");
});

test("a dose marked not scheduled is not counted", () => {
  const withGap: Vaccine = {
    id: "gap",
    name: "Gap",
    doses: [
      { slot: "birth", label: "Dose 1", status: "completed" },
      { slot: "6w", label: "Dose 2", status: "not_scheduled" },
    ],
  };
  const progress = progressOf([withGap]);
  assert.equal(progress.total, 1);
  assert.equal(progress.statusLabel, "Complete");
});

test("dates read MMM d, yyyy and never shift a calendar day", () => {
  assert.equal(formatRecordDate("2026-09-03"), "Sep 3, 2026");
  assert.equal(formatRecordDate("2026-01-01"), "Jan 1, 2026");
  assert.equal(formatRecordDate("2026-12-31"), "Dec 31, 2026");
});

test("an unreadable date reads as not recorded rather than an invented date", () => {
  assert.equal(formatRecordDate(""), "Not recorded");
  assert.equal(formatRecordDate("2026-02-30"), "Not recorded");
  assert.equal(formatRecordDate("soon"), "Not recorded");
});

test("long IDs keep their first 8 and last 5 characters", () => {
  assert.equal(truncateMiddle("abcdefgh1234567890vwxyz"), "abcdefgh…vwxyz");
});

test("short IDs are left whole", () => {
  assert.equal(truncateMiddle("abcdefgh12345"), "abcdefgh12345");
  assert.equal(truncateMiddle("abc"), "abc");
});

test("doseAt treats a missing slot and a not scheduled dose alike", () => {
  const sample = vaccine(["completed"]);
  assert.equal(doseAt(sample, "birth")?.label, "Dose 1");
  assert.equal(doseAt(sample, "12m"), null);
  const marked: Vaccine = { ...sample, doses: [{ slot: "6w", label: "Dose 1", status: "not_scheduled" }] };
  assert.equal(doseAt(marked, "6w"), null);
});

test("every cell has a meaningful spoken label", () => {
  const pending = { slot: "10w" as const, label: "Dose 2", status: "pending" as const };
  const done = { slot: "birth" as const, label: "Birth dose", status: "completed" as const, administeredOn: "2026-09-13" };
  assert.equal(doseSpokenLabel("MMR", "10 weeks", pending), "MMR, 10 weeks: Dose 2, requires review");
  assert.equal(doseSpokenLabel("BCG", "At birth", done), "BCG, At birth: Birth dose, administered Sep 13, 2026");
  assert.equal(doseSpokenLabel("BCG", "12 months", null), "BCG, 12 months: Not scheduled");
});

test("a missing sex reads as not recorded", () => {
  const meta = babyMeta({ name: "Test", dob: "2026-01-02", id: "abc", isSampleName: false });
  assert.deepEqual(meta, ["DOB: Jan 2, 2026", "Sex: Not recorded", "ID: abc"]);
});

test("mother details state whether an account is linked", () => {
  const mother = { name: "Test", dob: "1990-03-04", sex: "Female", purok: "Test purok", masterListId: "MSL-TEST", hasLinkedAccount: false };
  assert.deepEqual(motherMeta(mother), ["DOB: Mar 4, 1990", "Female, Test purok", "Master list: MSL-TEST", "No linked account"]);
  assert.equal(motherMeta({ ...mother, hasLinkedAccount: true })[3], "Linked account");
});

test("arrow keys wrap around the tabs, Home and End jump, other keys do nothing", () => {
  assert.equal(nextTab("vaccinations", "ArrowRight"), "visit");
  assert.equal(nextTab("history", "ArrowRight"), "vaccinations");
  assert.equal(nextTab("vaccinations", "ArrowLeft"), "history");
  assert.equal(nextTab("notes", "Home"), "vaccinations");
  assert.equal(nextTab("visit", "End"), "history");
  assert.equal(nextTab("visit", "Enter"), null);
});

test("sample data is plainly labelled test data", () => {
  assert.match(MOCK_RECORD.baby.name, /^Test /);
  assert.match(MOCK_RECORD.mother.name, /^Test /);
  assert.match(MOCK_RECORD.recordId, /TEST/);
  assert.match(MOCK_RECORD.mother.masterListId, /TEST/);
});
