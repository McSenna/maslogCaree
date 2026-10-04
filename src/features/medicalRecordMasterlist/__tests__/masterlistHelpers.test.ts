import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { CompletionForm, MedicalRecordInput } from "@/services/medicalRecordTypes";

import {
  CARD_CRITERIA,
  EMPTY_CRITERIA,
  formatCalendarDay,
  formatVisitDate,
  recordReference,
  selectedCard,
} from "../masterlistLabels.ts";
import { ALL, fromOption, toOption, yearOf, yearOptions, yearRange } from "../masterlistFilters.ts";
import {
  EMPTY_VISIT,
  hasMedicalDetail,
  newRequestKey,
  relaxForEncoding,
  residentProblem,
  sectionsNeedingFixes,
  validateVisit,
  valuesFromRecord,
  visitFromRecord,
} from "../recordEditorForm.ts";
import { changedFieldLabel, previousValueText } from "../revisionLabels.ts";
import type { EncodedRecord, ResidentIdentity } from "../types.ts";

// Test fixtures only: invented values, never real residents.
const form: CompletionForm = {
  categoryKey: "bp_checking",
  label: "BP Checking",
  common: [
    { key: "assessment", label: "Assessment", type: "textarea", required: true },
    { key: "notes", label: "Notes", type: "textarea" },
  ],
  service: [
    { key: "systolic", label: "Systolic", type: "number", required: true },
    { key: "recheckDate", label: "Recheck date", type: "date" },
  ],
  followUp: [{ key: "followUpRequired", label: "Follow-up required", type: "boolean" }],
};

const resident: ResidentIdentity = {
  masterResidentId: "TEST-A",
  fullName: "Testa Fixture",
  dateOfBirth: "1990-04-12",
  sex: "female",
  purok: "Purok 3",
  hasAccount: false,
};

describe("summary cards open the list they count", () => {
  it("maps each card to its linkage filter", () => {
    assert.deepEqual(CARD_CRITERIA.unlinked, { linkage: "unlinked" });
    assert.deepEqual(CARD_CRITERIA.total, {});
  });
  it("marks a card selected only when nothing else narrows the list", () => {
    assert.equal(selectedCard(EMPTY_CRITERIA), "total");
    assert.equal(selectedCard({ ...EMPTY_CRITERIA, linkage: "pending_review" }), "pending_review");
    assert.equal(selectedCard({ ...EMPTY_CRITERIA, linkage: "linked", search: "Testa" }), null);
  });
});

describe("dates and references", () => {
  it("reads a calendar day without shifting it", () => {
    assert.equal(formatCalendarDay("2024-03-15T00:00:00.000Z"), "Mar 15, 2024");
    assert.equal(formatCalendarDay(""), "Not recorded");
    assert.equal(formatVisitDate("historical_masterlist", "2024-01-01T00:00:00.000Z"), "Jan 1, 2024");
  });
  it("shortens a record ID the same way the resident view does", () => {
    assert.equal(recordReference("64b7f0c2a1b2c3d4e5f60718"), "REC-E5F60718");
  });
});

describe("visit year filter", () => {
  it("covers this year and fifteen before it", () => {
    const options = yearOptions(new Date(2026, 9, 2));
    assert.equal(options[0].value, ALL);
    assert.equal(options[1].value, "2026");
    assert.equal(options.at(-1)?.value, "2011");
  });
  it("turns a year into a full-year range and back", () => {
    assert.deepEqual(yearRange("2024"), { from: "2024-01-01", to: "2024-12-31" });
    assert.equal(yearOf({ ...EMPTY_CRITERIA, ...yearRange("2024") }), "2024");
    assert.deepEqual(yearRange(ALL), { from: "", to: "" });
  });
  it("maps the select's 'all' to an empty filter", () => {
    assert.equal(fromOption(ALL), "");
    assert.equal(toOption(""), ALL);
  });
});

describe("visit validation", () => {
  const now = new Date(2026, 9, 2);
  it("needs a real past calendar date", () => {
    assert.ok(validateVisit({ ...EMPTY_VISIT, visitDate: "03/15/2024" }, resident, now).visitDate);
    assert.ok(validateVisit({ ...EMPTY_VISIT, visitDate: "2024-02-30" }, resident, now).visitDate);
    assert.ok(validateVisit({ ...EMPTY_VISIT, visitDate: "2026-10-03" }, resident, now).visitDate);
    assert.deepEqual(validateVisit({ ...EMPTY_VISIT, visitDate: "2024-03-15" }, resident, now), {});
  });
  it("refuses a visit before the resident was born", () => {
    assert.match(validateVisit({ ...EMPTY_VISIT, visitDate: "1989-01-01" }, resident, now).visitDate, /birth date/);
  });
});

describe("encoding form", () => {
  it("makes the assessment optional and nothing else", () => {
    const relaxed = relaxForEncoding(form);
    assert.equal(relaxed.common[0].required, false);
    assert.equal(relaxed.service[0].required, true);
    assert.equal(form.common[0].required, true);
  });
  it("needs at least one medical value", () => {
    const blank: MedicalRecordInput = { assessment: "", serviceDetails: {} };
    assert.equal(hasMedicalDetail(blank), false);
    assert.equal(hasMedicalDetail({ ...blank, serviceDetails: { systolic: 120 } }), true);
    assert.equal(hasMedicalDetail({ ...blank, notes: "Seen" }), true);
  });
  it("prefills an edit from the saved record", () => {
    const record: EncodedRecord = {
      _id: "r1",
      serviceType: "bp_checking",
      assessment: "",
      notes: "Note",
      completedAt: "2024-03-15T00:00:00.000Z",
      serviceDetails: { systolic: 130, recheckDate: "2024-04-01T00:00:00.000Z" },
      followUpRequired: true,
      source: "walk_in",
      providerName: "Test Provider",
      providerRole: "bhw",
    };
    const values = valuesFromRecord(form, record);
    assert.equal(values.systolic, "130");
    assert.equal(values.recheckDate, "2024-04-01");
    assert.equal(values.followUpRequired, true);
    assert.deepEqual(visitFromRecord(record), {
      visitDate: "2024-03-15",
      source: "walk_in",
      providerName: "Test Provider",
      providerRole: "bhw",
      visitReason: "",
    });
  });
  it("gives every record its own request key", () => {
    let seed = 0;
    const random = () => (seed += 0.1);
    assert.notEqual(newRequestKey(random), newRequestKey(random));
  });
});

describe("record history wording", () => {
  it("names changed fields the way the form does", () => {
    assert.equal(changedFieldLabel("serviceDetails.systolic", form), "Systolic");
    assert.equal(changedFieldLabel("completedAt", form), "Visit date");
    assert.equal(changedFieldLabel("notes", form), "Notes");
  });
  it("reads earlier values plainly", () => {
    assert.equal(previousValueText("notes", null), "Not recorded");
    assert.equal(previousValueText("followUpRequired", false), "No");
    assert.equal(previousValueText("completedAt", "2024-03-15T00:00:00.000Z"), "2024-03-15");
    assert.equal(previousValueText("serviceDetails.systolic", 130), "130");
  });
});

describe("one-form validation", () => {
  it("needs a chosen and confirmed resident, never an account", () => {
    assert.match(residentProblem(null, false), /Choose the resident/);
    assert.match(residentProblem(resident, false), /Confirm/);
    assert.equal(residentProblem({ ...resident, hasAccount: false }, true), "");
  });
  it("lists the sections still showing an error, in form order", () => {
    const sections = sectionsNeedingFixes({
      resident: "Choose the resident this record belongs to.",
      visit: { visitDate: "Enter the visit date", serviceType: "", providerName: "" },
      medical: { systolic: "Systolic is required.", diastolic: "" },
      medicalLabel: "BP Checking details",
      reason: "",
    });
    assert.deepEqual(sections, ["Resident", "Visit date", "BP Checking details"]);
  });
  it("is empty once every error is cleared", () => {
    assert.deepEqual(sectionsNeedingFixes({ resident: "", visit: {}, medical: { systolic: "" }, medicalLabel: "BP", reason: "" }), []);
  });
});
