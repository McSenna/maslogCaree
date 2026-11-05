import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { CompletionForm, MedicalRecord } from "../../../../services/medicalRecordTypes";
import type { Checklist, DoseRecord, DoseView } from "../../types";
import { detailGroupsOf, doseCountsOf, entriesFromChecklist, nextDoseNote } from "../ledgerEntries.ts";
import { babyIdOf, isImmunizationRecord, mayReadDoseLedger, scopeOf, withoutGeneratedProgress } from "../vaccinationScope.ts";
import { entriesFromVisitRecord } from "../visitEntry.ts";

const record = (doseKey: string, extra: Partial<DoseRecord>): DoseRecord => ({
  _id: `TEST-${doseKey}`, babyId: "TEST-BABY", doseKey, state: "administered",
  history: [], createdAt: "2026-01-01", updatedAt: "2026-01-01", ...extra,
});

const dose = (key: string, label: string, targetOn: string, doseRecord: DoseRecord | null, vaccineKey = key.split("-")[0]): DoseView => ({
  key, vaccineKey, label, slot: "w6", targetOn, scheduledOn: doseRecord?.followUpOn ?? targetOn,
  status: doseRecord?.state === "administered" ? "Administered" : "Upcoming", reviewRequired: false, record: doseRecord,
});

const checklistOf = (doses: DoseView[], extraHistory: DoseRecord[] = []): Checklist => ({
  baby: { _id: "TEST-BABY", name: "Test baby", dateOfBirth: "2026-01-01", motherMasterResidentId: "TEST-MOTHER", temporaryName: false, scheduleVersion: "v1", age: { months: 3, days: 0, weeks: 13 } },
  mother: { masterResidentId: "TEST-MOTHER", name: "Test mother" },
  accountLinked: true, remindersEnabled: true, nextScheduledDate: null, legacyReviewRequired: false,
  schedule: {
    version: "v1", title: "Test schedule", source: "test", effectiveOn: "2026-01-01", activationStatus: "active", dueWindowDays: 7,
    slots: [{ key: "w6", label: "6 weeks" }],
    vaccines: [{ key: "penta", name: "Pentavalent", disease: "Test", route: "Intramuscular", doses: [] }, { key: "bcg", name: "BCG", disease: "Test", route: "Intradermal", doses: [] }],
  },
  doses,
  history: [...doses.flatMap((item) => (item.record ? [item.record] : [])), ...extraHistory],
});

const given = (doseKey: string, administeredOn: string, extra: Partial<DoseRecord> = {}) => record(doseKey, { administeredOn, ...extra });

describe("entriesFromChecklist", () => {
  it("keeps repeated doses of one vaccine as separate labeled entries, oldest first", () => {
    const entries = entriesFromChecklist(checklistOf([
      dose("penta-2", "Dose 2", "2026-03-01", given("penta-2", "2026-03-05")),
      dose("penta-1", "Dose 1", "2026-02-01", given("penta-1", "2026-02-03")),
    ]));
    assert.deepEqual(entries.map((entry) => [entry.id, entry.vaccineName, entry.doseLabel, entry.dateLabel]), [
      ["penta-1", "Pentavalent", "Dose 1", "Feb 3, 2026"],
      ["penta-2", "Pentavalent", "Dose 2", "Mar 5, 2026"],
    ]);
  });

  it("never lists a scheduled dose without a record", () => {
    const list = checklistOf([dose("penta-1", "Dose 1", "2026-02-01", null), dose("bcg-1", "Birth dose", "2026-01-01", given("bcg-1", "2026-01-02"))]);
    assert.deepEqual(entriesFromChecklist(list).map((entry) => entry.id), ["bcg-1"]);
    assert.deepEqual(doseCountsOf(list), { administered: 1, total: 2 });
  });

  it("reads the next dose from the same series and skips doses already given", () => {
    const entries = entriesFromChecklist(checklistOf([
      dose("penta-1", "Dose 1", "2026-02-01", given("penta-1", "2026-02-01")),
      dose("penta-2", "Dose 2", "2026-03-01", given("penta-2", "2026-03-01")),
      dose("penta-3", "Dose 3", "2026-04-01", null),
      dose("bcg-1", "Birth dose", "2026-01-01", given("bcg-1", "2026-01-01")),
    ]));
    const nextOf = (id: string) => entries.find((entry) => entry.id === id)?.nextDose;
    assert.equal(nextOf("penta-1"), "Dose 3, Apr 1, 2026");
    assert.equal(nextOf("penta-2"), "Dose 3, Apr 1, 2026");
    assert.equal(nextOf("bcg-1"), "None scheduled");
    const fieldOf = (id: string) => entries.find((entry) => entry.id === id)?.fields.find((field) => field.label === "Next scheduled dose")?.value;
    assert.equal(fieldOf("penta-2"), "Dose 3, Apr 1, 2026");
  });

  it("does not present a voided dose's stored values as administered", () => {
    const [entry] = entriesFromChecklist(checklistOf([
      dose("penta-1", "Dose 1", "2026-02-01", record("penta-1", { state: "void", administeredOn: "2026-02-03", lotNumber: "TEST-LOT", reason: "Wrong baby selected" })),
    ]));
    assert.equal(entry.administered, false);
    assert.equal(entry.status, "voided");
    assert.equal(entry.dateLabel, "Not administered");
    assert.equal(entry.fields.some((field) => field.value === "TEST-LOT" || field.label === "Date administered"), false);
    assert.equal(entry.fields.find((field) => field.label === "Reason")?.value, "Wrong baby selected");
  });

  it("keeps a draft out of the doses given, even with a date typed in", () => {
    const list = checklistOf([
      dose("bcg-1", "Birth dose", "2026-01-01", given("bcg-1", "2026-06-01")),
      dose("penta-1", "Dose 1", "2026-02-01", record("penta-1", { state: "pending", workflowStatus: "draft", administeredOn: "2026-02-03" })),
    ]);
    const entries = entriesFromChecklist(list);
    assert.deepEqual(entries.map((entry) => [entry.id, entry.status, entry.dateLabel]), [
      ["bcg-1", "administered", "Jun 1, 2026"],
      ["penta-1", "draft", "Not administered"],
    ]);
    assert.equal(doseCountsOf(list).administered, 1);
  });

  it("orders deferred doses after the doses given and shows the follow-up date", () => {
    const entries = entriesFromChecklist(checklistOf([
      dose("penta-1", "Dose 1", "2026-02-01", record("penta-1", { state: "deferred", followUpOn: "2026-02-20", reason: "Fever at visit" })),
      dose("bcg-1", "Birth dose", "2026-01-01", given("bcg-1", "2026-01-02")),
    ]));
    assert.deepEqual(entries.map((entry) => entry.id), ["bcg-1", "penta-1"]);
    assert.equal(entries[1].nextDose, "Dose 1, Feb 20, 2026");
    assert.equal(entries[1].fields.find((field) => field.label === "Follow-up date")?.value, "Feb 20, 2026");
  });

  it("shows a recorded reaction and reads Not recorded for a blank one, never None", () => {
    const [entry] = entriesFromChecklist(checklistOf([dose("bcg-1", "Birth dose", "2026-01-01", given("bcg-1", "2026-01-02", { immediateReaction: "Mild redness", aefi: "  " }))]));
    const valueOf = (label: string) => entry.fields.find((field) => field.label === label)?.value;
    assert.equal(valueOf("Immediate reaction"), "Mild redness");
    assert.equal(valueOf("Adverse event (AEFI)"), "Not recorded");
  });

  it("does not show a voided dose's stored reaction", () => {
    const [entry] = entriesFromChecklist(checklistOf([dose("bcg-1", "Birth dose", "2026-01-01", record("bcg-1", { state: "void", immediateReaction: "TEST-REACTION" }))]));
    assert.equal(entry.fields.some((field) => field.value === "TEST-REACTION"), false);
  });

  it("shows lot, route and site only when the dose has them", () => {
    const [older] = entriesFromChecklist(checklistOf([dose("bcg-1", "Birth dose", "2026-01-01", given("bcg-1", "2026-01-02", { site: "Left thigh", lotNumber: "TEST-LOT", route: "Oral" }))]));
    const [newer] = entriesFromChecklist(checklistOf([dose("bcg-1", "Birth dose", "2026-01-01", given("bcg-1", "2026-01-02"))]));
    const valueOf = (label: string) => older.fields.find((field) => field.label === label)?.value;
    assert.deepEqual([valueOf("Site"), valueOf("Batch or lot number"), valueOf("Route")], ["Left thigh", "TEST-LOT", "Oral"]);
    assert.equal(newer.fields.some((field) => ["Site", "Batch or lot number", "Route"].includes(field.label)), false);
  });

  it("reads Not recorded for blank optional values", () => {
    const [entry] = entriesFromChecklist(checklistOf([dose("bcg-1", "Birth dose", "2026-01-01", given("bcg-1", "2026-01-02", { facility: "  " }))]));
    assert.equal(entry.fields.find((field) => field.label === "Location")?.value, "Not recorded");
    assert.equal(entry.fields.some((field) => field.label === "Correction reason"), false);
  });

  it("keeps a saved dose whose key left the schedule visible", () => {
    const [entry] = entriesFromChecklist(checklistOf([], [given("legacy-1", "2025-12-01")]));
    assert.equal(entry.id, "legacy-1");
    assert.equal(entry.doseLabel, "Saved dose");
    assert.equal(entry.nextDose, "Not recorded");
  });

  it("says when the schedule is not verified", () => {
    const list = checklistOf([]);
    assert.match(nextDoseNote(list), /routine targets/);
    assert.match(nextDoseNote({ ...list, schedule: { ...list.schedule, activationStatus: "pending_verification" } }), /has not verified/);
  });
});

describe("detailGroupsOf", () => {
  const entries = entriesFromChecklist(checklistOf([
    dose("penta-1", "Dose 1", "2026-02-01", given("penta-1", "2026-02-03")),
    dose("penta-2", "Dose 2", "2026-03-01", given("penta-2", "2026-03-05")),
    dose("bcg-1", "Birth dose", "2026-01-01", record("bcg-1", { state: "deferred", followUpOn: "2026-12-01" })),
  ]));
  const shape = (keys: string[] | null) => detailGroupsOf(entries, keys).map((group) => [group.title, group.entries.map((entry) => entry.id)]);

  it("keeps a visit's care apart from the rest of the baby's record", () => {
    assert.deepEqual(shape(["penta-2"]), [
      ["Documented at this visit", ["penta-2"]],
      ["Other doses administered", ["penta-1"]],
      ["Not administered", ["bcg-1"]],
    ]);
  });

  it("groups by given and not given when there is no visit", () => {
    assert.deepEqual(shape(null), [
      ["Doses administered", ["penta-1", "penta-2"]],
      ["Not administered", ["bcg-1"]],
    ]);
  });
});

const form: CompletionForm = {
  categoryKey: "immunization", label: "Immunization", common: [], followUp: [],
  service: [
    { key: "route", label: "Route of administration", type: "select", options: [{ value: "intramuscular", label: "Intramuscular" }] },
    { key: "adverseReaction", label: "Adverse reaction", type: "textarea" },
  ],
};
const visit = (serviceDetails: MedicalRecord["serviceDetails"], extra: Partial<MedicalRecord> = {}): MedicalRecord => ({
  _id: "TEST-RECORD", serviceType: "immunization", assessment: "", completedAt: "2024-03-15", serviceDetails, ...extra,
});

describe("entriesFromVisitRecord", () => {
  it("builds one entry with reactions, option labels and no timezone shift", () => {
    const [entry] = entriesFromVisitRecord(visit({ vaccineName: "Test vaccine", doseNumber: 2, route: "intramuscular", administrationDate: "2024-03-15", adverseReaction: "Test reaction" }, { providerName: "Test nurse" }), form);
    assert.equal(entry.doseLabel, "Dose 2");
    assert.equal(entry.dateLabel, "Mar 15, 2024");
    const valueOf = (label: string) => entry.fields.find((field) => field.label === label)?.value;
    assert.equal(valueOf("Route of administration"), "Intramuscular");
    assert.equal(valueOf("Adverse reaction"), "Test reaction");
    assert.equal(valueOf("Provider"), "Test nurse");
    assert.equal(valueOf("Next immunisation schedule"), "Not recorded");
  });

  it("never turns a blank reaction into None", () => {
    const [entry] = entriesFromVisitRecord(visit({ vaccineName: "Test vaccine" }), null);
    assert.equal(entry.fields.find((field) => field.label === "Adverse reaction")?.value, "Not recorded");
    assert.equal(entry.dateLabel, "Not recorded");
  });

  it("returns nothing for a record with no vaccine fields", () => {
    assert.deepEqual(entriesFromVisitRecord(visit({ ledgerSummary: true }), form), []);
    assert.deepEqual(entriesFromVisitRecord(visit(undefined), null), []);
  });

  it("flags incomplete vaccine details instead of claiming a dose was given", () => {
    const [entry] = entriesFromVisitRecord(visit({ doseNumber: 1 }), null);
    assert.equal(entry.vaccineName, "Vaccine not recorded");
    assert.equal(entry.administered, false);
    assert.equal(entry.status, "review");
  });

  it("keeps a stored field the form no longer names", () => {
    const [entry] = entriesFromVisitRecord(visit({ vaccineName: "Test vaccine", olderField: "Kept value" }), form);
    assert.equal(entry.fields.find((field) => field.label === "olderField")?.value, "Kept value");
  });
});

describe("withoutGeneratedProgress", () => {
  const generated = "Routine immunization checklist: 2 of 15 doses documented as administered.";
  const baby = { _id: "TEST-BABY", name: "Test", dateOfBirth: "2026-01-01" };

  it("removes the generated count from a baby's program record and keeps its other findings", () => {
    const cleared = withoutGeneratedProgress({ immunizationBabyId: baby, assessment: generated, findings: "Test finding" });
    assert.equal(cleared.assessment, "");
    assert.equal(cleared.findings, "Test finding");
  });

  it("keeps an assessment a clinician wrote", () => {
    const written = "Routine immunization checklist reviewed with the mother.";
    assert.equal(withoutGeneratedProgress({ immunizationBabyId: baby, assessment: written }).assessment, written);
  });

  it("leaves a record with no baby program link alone, even with the same words", () => {
    assert.equal(withoutGeneratedProgress({ assessment: generated }).assessment, generated);
  });
});

describe("record scope", () => {
  it("detects the category by its identifier only", () => {
    assert.equal(isImmunizationRecord({ serviceType: "immunization" }), true);
    assert.equal(isImmunizationRecord({ serviceType: "prenatal" }), false);
    assert.equal(isImmunizationRecord(null), false);
  });

  it("tells a ledger record, a ledger visit and a single visit apart", () => {
    assert.equal(scopeOf({ immunizationBabyId: { _id: "TEST-BABY", name: "Test", dateOfBirth: "2026-01-01" } }), "ledger");
    assert.equal(babyIdOf({ immunizationBabyId: "TEST-BABY" }), "TEST-BABY");
    assert.equal(scopeOf({ serviceDetails: { ledgerSummary: true } }), "ledger_visit");
    assert.equal(scopeOf({ serviceDetails: { vaccineName: "Test" } }), "single_visit");
  });

  it("matches the server's roles for reading the ledger", () => {
    assert.deepEqual(["midwife", "resident", "admin", "doctor", "bhw"].map(mayReadDoseLedger), [true, true, false, false, false]);
  });
});
