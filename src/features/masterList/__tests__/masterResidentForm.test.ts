import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { MasterResidentRecord } from "../masterList.types.ts";
import { resolveMasterListView } from "../masterListView.ts";
import {
  emptyMasterForm,
  formFromRecord,
  formatBirthDate,
  masterFullName,
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
    assert.deepEqual(
      validateMasterForm(formFromRecord(record), { isEditing: true, today }),
      {},
    );
  });

  it("asks for every required official field", () => {
    const errors = validateMasterForm(emptyMasterForm(""), {
      isEditing: false,
      today,
    });
    assert.deepEqual(Object.keys(errors).sort(), [
      "address",
      "barangay",
      "civilStatus",
      "dateOfBirth",
      "firstName",
      "lastName",
      "sex",
    ]);
  });

  it("refuses impossible, future and badly formatted birth dates", () => {
    for (const dateOfBirth of ["1990-02-30", "2999-01-01", "04/12/1990"]) {
      const errors = validateMasterForm(
        { ...formFromRecord(record), dateOfBirth },
        { isEditing: true, today },
      );
      assert.ok(errors.dateOfBirth, dateOfBirth);
    }
  });

  it("checks a typed record ID only when adding", () => {
    const values = { ...formFromRecord(record), masterResidentId: "bad id!" };
    assert.ok(
      validateMasterForm(values, { isEditing: false, today }).masterResidentId,
    );
    assert.equal(
      validateMasterForm(values, { isEditing: true, today }).masterResidentId,
      undefined,
    );
  });
});

describe("toMasterInput", () => {
  it("trims values and never sends a record ID when editing", () => {
    const input = toMasterInput(
      { ...formFromRecord(record), firstName: "  Testa " },
      true,
    );
    assert.equal(input.firstName, "Testa");
    assert.equal("masterResidentId" in input, false);
  });

  it("lets the server generate an ID when the field is blank", () => {
    assert.equal(
      "masterResidentId" in toMasterInput(emptyMasterForm("Testville"), false),
      false,
    );
    assert.equal(
      toMasterInput(
        { ...emptyMasterForm("Testville"), masterResidentId: " MSL-1 " },
        false,
      ).masterResidentId,
      "MSL-1",
    );
  });

  it("carries no account or status fields", () => {
    const keys = Object.keys(toMasterInput(formFromRecord(record), true));
    for (const forbidden of [
      "isActive",
      "linkedAccount",
      "email",
      "status",
    ])
      assert.equal(keys.includes(forbidden), false, forbidden);
  });
});

describe("display helpers", () => {
  it("formats names, dates and ranges", () => {
    assert.equal(
      masterFullName({ ...record, suffix: "Jr." }),
      "Testa Sample Fixture Jr.",
    );
    assert.equal(formatBirthDate("1990-04-12"), "Apr 12, 1990");
  });

  it("picks the list state", () => {
    assert.equal(
      resolveMasterListView({
        isLoading: true,
        error: null,
        shown: 0,
        filtered: false,
      }),
      "loading",
    );
    assert.equal(
      resolveMasterListView({
        isLoading: false,
        error: new Error("x"),
        shown: 0,
        filtered: false,
      }),
      "error",
    );
    assert.equal(
      resolveMasterListView({
        isLoading: false,
        error: null,
        shown: 0,
        filtered: true,
      }),
      "noResults",
    );
    assert.equal(
      resolveMasterListView({
        isLoading: false,
        error: null,
        shown: 0,
        filtered: false,
      }),
      "empty",
    );
    assert.equal(
      resolveMasterListView({
        isLoading: false,
        error: null,
        shown: 3,
        filtered: false,
      }),
      "list",
    );
  });
});

describe("single-page error navigation", async () => {
  const { orderedMasterErrors } = await import("../masterResidentSections.ts");

  it("orders server errors by reading order so the first fix is predictable", () => {
    assert.deepEqual(
      orderedMasterErrors({
        address: "Enter address",
        sex: "Choose sex",
        firstName: "Enter name",
      }),
      [
        { field: "firstName", label: "First Name", message: "Enter name" },
        { field: "sex", label: "Sex", message: "Choose sex" },
        {
          field: "address",
          label: "Purok",
          message: "Enter address",
        },
      ],
    );
  });

  it("omits cleared errors and supports a form-level failure without field errors", () => {
    assert.deepEqual(orderedMasterErrors({ firstName: undefined }), []);
    assert.deepEqual(orderedMasterErrors({}), []);
  });
});


describe("resident classification", () => {
  it("defaults new and unclassified records to Resident", () => {
    assert.equal(emptyMasterForm("Testville").role, "resident");
    const { role: _role, ...legacy } = record;
    assert.equal(formFromRecord(legacy).role, "resident");
  });

  it("preselects and submits every saved classification without account fields", () => {
    for (const role of ["resident", "bhw", "midwife"] as const) {
      const form = formFromRecord({ ...record, role });
      assert.equal(form.role, role);
      assert.deepEqual(validateMasterForm(form, { isEditing: true, today }), {});
      assert.equal(toMasterInput(form, true).role, role);
      assert.equal(toMasterInput(form, false).role, role);
    }
  });

  it("requires one allowed role and includes it in error navigation", async () => {
    const { orderedMasterErrors } = await import("../masterResidentSections.ts");
    for (const role of ["", "admin", "doctor", "BHW"]) {
      const errors = validateMasterForm({ ...formFromRecord(record), role }, { isEditing: false, today });
      assert.ok(errors.role);
      assert.equal(orderedMasterErrors(errors)[0]?.field, "role");
    }
  });
});
