import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { MasterResidentRecord } from "../../masterList.types.ts";
import { canEditResidentRecord } from "../residentDetailsAccess.ts";
import {
  NOT_RECORDED,
  residentDisplayName,
  residentFieldGroups,
  residentInitials,
  toResidentDetails,
} from "../residentDetailsModel.ts";

// The sample resident named in the design brief; not a real person's data.
const EFREN: MasterResidentRecord = {
  _id: "6a1ce7b1950000000000e7b1",
  masterResidentId: "MSL-1CE7B195",
  firstName: "Efren",
  middleName: "Romero",
  lastName: "Abaleta",
  suffix: "",
  dateOfBirth: "1958-10-13",
  sex: "male",
  civilStatus: "married",
  barangay: "Maslog",
  address: "Purok 2, Pangulo",
  role: "resident",
  isActive: true,
  linkedAccount: false,
  createdAt: "2026-10-21T02:00:00.000Z",
  updatedAt: "2026-10-21T02:00:00.000Z",
};

const valuesOf = (record: MasterResidentRecord) =>
  Object.fromEntries(
    residentFieldGroups(toResidentDetails(record))
      .flatMap((group) => group.fields)
      .map((field) => [field.label, field.value]),
  );

describe("resident details model", () => {
  it("renders the sample resident exactly as the design shows", () => {
    const details = toResidentDetails(EFREN);
    assert.equal(residentDisplayName(details), "Efren Romero Abaleta");
    assert.equal(residentInitials(details), "EA");
    assert.deepEqual(valuesOf(EFREN), {
      "Last name": "Abaleta",
      "First name": "Efren",
      "Middle name": "Romero",
      Suffix: NOT_RECORDED,
      "Date of birth": "Oct 13, 1958",
      Sex: "Male",
      "Civil status": "Married",
      "Record ID": "MSL-1CE7B195",
      Role: "Resident",
      Purok: "Purok 2, Pangulo",
      Barangay: "Maslog",
      Status: "Active",
      "App account": "Not linked",
      Added: "Oct 21, 2026",
      "Last updated": "Oct 21, 2026",
    });
  });

  it("keeps the design's group order and headings", () => {
    const groups = residentFieldGroups(toResidentDetails(EFREN));
    assert.deepEqual(
      groups.map((group) => group.title),
      ["Personal information", "Residency / Record details", "Record history"],
    );
  });

  it("marks every empty optional field as Not recorded", () => {
    const sparse = { ...EFREN, middleName: "  ", suffix: "", civilStatus: "", updatedAt: undefined };
    const fields = residentFieldGroups(toResidentDetails(sparse)).flatMap((group) => group.fields);
    const empty = fields.filter((field) => !field.recorded).map((field) => field.label);
    assert.deepEqual(empty, ["Middle name", "Suffix", "Civil status", "Last updated"]);
    for (const field of fields.filter((item) => !item.recorded)) assert.equal(field.value, NOT_RECORDED);
  });

  it("shows inactive, linked records and a suffix", () => {
    const values = valuesOf({ ...EFREN, isActive: false, linkedAccount: true, suffix: "Jr." });
    assert.equal(values.Status, "Inactive");
    assert.equal(values["App account"], "Linked");
    assert.equal(residentDisplayName(toResidentDetails({ ...EFREN, suffix: "Jr." })), "Efren Romero Abaleta Jr.");
  });

  it("falls back cleanly when a name is missing", () => {
    const details = toResidentDetails({ ...EFREN, firstName: "", middleName: "" });
    assert.equal(residentDisplayName(details), "Abaleta");
    assert.equal(residentInitials(details), "A");
  });
});

describe("resident details permissions", () => {
  it("lets only admins edit, matching the admin-only server routes", () => {
    assert.equal(canEditResidentRecord("admin"), true);
    assert.equal(canEditResidentRecord(" Admin "), true);
    for (const role of ["doctor", "midwife", "bhw", "resident", "", null, undefined]) {
      assert.equal(canEditResidentRecord(role), false, String(role));
    }
  });
});
