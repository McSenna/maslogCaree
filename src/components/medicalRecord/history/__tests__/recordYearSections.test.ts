import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { MedicalRecord } from "@/services/medicalRecordTypes";

import { groupRecordsByYear } from "../recordYearSections.ts";

const record = (id: string, completedAt: string): MedicalRecord => ({ _id: id, serviceType: "bp_checking", assessment: "", completedAt });

describe("history grouped by year", () => {
  it("keeps the newest-first order and starts a heading at each new year", () => {
    const sections = groupRecordsByYear([
      record("a", "2026-10-02T03:00:00.000Z"),
      record("b", "2026-01-15T03:00:00.000Z"),
      record("c", "2024-03-15T03:00:00.000Z"),
    ]);
    assert.deepEqual(sections.map((section) => section.title), ["2026", "2024"]);
    assert.deepEqual(sections[0].data.map((row) => row._id), ["a", "b"]);
  });
  it("returns no sections for no records", () => {
    assert.deepEqual(groupRecordsByYear([]), []);
  });
});
