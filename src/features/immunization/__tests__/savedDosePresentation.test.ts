import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { historyDose, savedDoseStatus } from "../savedDosePresentation.ts";
import type { Checklist, DoseRecord } from "../types";

const record: DoseRecord = {
  _id: "TEST-RECORD", babyId: "TEST-BABY", doseKey: "legacy-dose",
  state: "void", recordedBy: "TEST-MIDWIFE", revision: 0,
  createdAt: "2026-10-26T00:00:00Z", updatedAt: "2026-10-26T00:00:00Z",
  history: [{ action: "follow_up", reason: "Review paper card", actor: "TEST-MIDWIFE", at: "2026-10-26T00:00:00Z", previous: {} }],
};
const checklist: Checklist = {
  baby: { _id: "TEST-BABY", name: "Test baby", dateOfBirth: "2026-10-01", motherMasterResidentId: "TEST-MOTHER", temporaryName: false, scheduleVersion: "test", age: { months: 0, days: 25, weeks: 3 } },
  mother: { name: "Test mother", masterResidentId: "TEST-MOTHER" }, accountLinked: false,
  remindersEnabled: false, schedule: { version: "test", title: "Test schedule", source: "Test fixture", effectiveOn: "2026-10-01", activationStatus: "pending_verification", dueWindowDays: 7, slots: [], vaccines: [] },
  doses: [], nextScheduledDate: null, legacyReviewRequired: true, history: [record],
};

describe("saved vaccination presentation", () => {
  it("labels a draft without implying administration", () => {
    assert.equal(savedDoseStatus({ ...record, state: "pending", workflowStatus: "draft" }), "Draft. Not administered");
  });
  it("distinguishes review follow-ups from voided administrations", () => {
    assert.equal(savedDoseStatus(record), "Requires review");
    assert.equal(savedDoseStatus({ ...record, history: [{ ...record.history[0], action: "voided" }] }), "Voided");
    assert.equal(savedDoseStatus({ ...record, history: [] }), "Voided");
    assert.equal(savedDoseStatus({ ...record, state: "deferred" }), "Deferred");
    assert.equal(savedDoseStatus({ ...record, state: "administered" }), "Administered");
  });
  it("keeps an unrecognized legacy dose inspectable without inventing its schedule", () => {
    const dose = historyDose(checklist, record);
    assert.equal(dose.key, "legacy-dose");
    assert.equal(dose.record, record);
    assert.equal(dose.targetOn, "");
    assert.equal(dose.reviewRequired, true);
    assert.equal(checklist.doses.some(item => item.key === dose.key), false);
  });
});
