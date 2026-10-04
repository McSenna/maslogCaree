import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { MasterResidentRecord } from "../masterList.types.ts";
import { resolveMasterListView } from "../masterListView.ts";
import {
  emptyMasterForm,
  formFromRecord,
  formatBirthDate,
  masterFullName,
  recordRangeLine,
  toMasterInput,
  validateMasterForm,
} from "../masterResidentForm.ts";

// Test fixtures only: invented values, never real residents.
const record: MasterResidentRecord = {
  _id: "r1",
  masterResidentId: "TEST-A",
  firstName: "Testa",
  middleName: "Sample",
  lastName: "Fixture",
  suffix: "",
  dateOfBirth: "1990-04-12",
  sex: "female",
  civilStatus: "single",
  barangay: "Testville",
  address: "Purok 3, Sampaguita Street",
  role: "resident",
  isActive: true,
  linkedAccount: false,
};

const today = new Date("2026-10-02T00:00:00.000Z");

describe("emptyMasterForm", () => {
  it("prefills only the barangay; sex, birth date and civil status stay blank", () => {
    const form = emptyMasterForm("Testville");
    assert.equal(form.barangay, "Testville");
    assert.equal(form.sex, "");
    assert.equal(form.civilStatus, "");
    assert.equal(form.dateOfBirth, "");
  });
});

describe("validateMasterForm", () => {
  it("accepts a complete record", () => {
    assert.deepEqual(validateMasterForm(formFromRecord(record), { isEditing: true, today }), {});
  });

  it("asks for every required official field", () => {
    const errors = validateMasterForm(emptyMasterForm(""), { isEditing: false, today });
    assert.deepEqual(Object.keys(errors).sort(), ["address", "barangay", "civilStatus", "dateOfBirth", "firstName", "lastName", "sex"]);
  });

  it("refuses impossible, future and badly formatted birth dates", () => {
    for (const dateOfBirth of ["1990-02-30", "2999-01-01", "04/12/1990"]) {
      const errors = validateMasterForm({ ...formFromRecord(record), dateOfBirth }, { isEditing: true, today });
      assert.ok(errors.dateOfBirth, dateOfBirth);
    }
  });

  it("checks a typed record ID only when adding", () => {
    const values = { ...formFromRecord(record), masterResidentId: "bad id!" };
    assert.ok(validateMasterForm(values, { isEditing: false, today }).masterResidentId);
    assert.equal(validateMasterForm(values, { isEditing: true, today }).masterResidentId, undefined);
  });
});

describe("toMasterInput", () => {
  it("trims values and never sends a record ID when editing", () => {
    const input = toMasterInput({ ...formFromRecord(record), firstName: "  Testa " }, true);
    assert.equal(input.firstName, "Testa");
    assert.equal("masterResidentId" in input, false);
  });

  it("lets the server generate an ID when the field is blank", () => {
    assert.equal("masterResidentId" in toMasterInput(emptyMasterForm("Testville"), false), false);
    assert.equal(toMasterInput({ ...emptyMasterForm("Testville"), masterResidentId: " MSL-1 " }, false).masterResidentId, "MSL-1");
  });

  it("carries no account or status fields", () => {
    const keys = Object.keys(toMasterInput(formFromRecord(record), true));
    for (const forbidden of ["role", "isActive", "linkedAccount", "email", "status"]) assert.equal(keys.includes(forbidden), false, forbidden);
  });
});

describe("display helpers", () => {
  it("formats names, dates and ranges", () => {
    assert.equal(masterFullName({ ...record, suffix: "Jr." }), "Testa Sample Fixture Jr.");
    assert.equal(formatBirthDate("1990-04-12"), "Apr 12, 1990");
    assert.equal(recordRangeLine(2, 20, 5, 25), "Showing 21 to 25 of 25 records");
    assert.equal(recordRangeLine(1, 20, 0, 0), "No records");
  });

  it("picks the list state", () => {
    assert.equal(resolveMasterListView({ isLoading: true, error: null, shown: 0, filtered: false }), "loading");
    assert.equal(resolveMasterListView({ isLoading: false, error: new Error("x"), shown: 0, filtered: false }), "error");
    assert.equal(resolveMasterListView({ isLoading: false, error: null, shown: 0, filtered: true }), "noResults");
    assert.equal(resolveMasterListView({ isLoading: false, error: null, shown: 0, filtered: false }), "empty");
    assert.equal(resolveMasterListView({ isLoading: false, error: null, shown: 3, filtered: false }), "list");
  });
});

describe("master record steps", async () => {
  const { MASTER_STEPS, MASTER_STEP_FIELDS, errorsForStep, firstStepWithError } = await import("../masterResidentSteps.ts");

  it("mirrors the registration rhythm: three entry steps, then review", () => {
    assert.deepEqual(MASTER_STEPS.map((step) => step.key), ["name", "details", "address", "review"]);
  });

  it("puts every form field on exactly one step", () => {
    const fields = Object.values(MASTER_STEP_FIELDS).flat().sort();
    assert.deepEqual(fields, Object.keys(emptyMasterForm("")).sort());
  });

  it("keeps only the current step's errors", () => {
    const errors = { firstName: "x", sex: "y", address: "z" };
    assert.deepEqual(errorsForStep("details", errors), { sex: "y" });
  });

  it("sends a failed save to the first step that needs fixing", () => {
    assert.equal(firstStepWithError({ address: "z", sex: "y" }), 1);
    assert.equal(firstStepWithError({}), -1);
  });
});
