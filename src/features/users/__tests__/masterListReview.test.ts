import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  MasterListReview,
  MasterResidentRecord,
  UserRequestResident,
} from "../services/userRequestTypes.ts";
import {
  approvalLinkNote,
  buildComparisonRows,
  formatCalendarDate,
} from "../components/requests/masterList/masterListComparison.ts";
import { describeOutcome, REASON_LABELS } from "../components/requests/masterList/masterListCopy.ts";

// Test fixtures only: invented values, never real residents.
const resident: UserRequestResident = {
  fullname: "Testa Sample Fixture",
  firstName: "Testa",
  middleName: "Sample",
  surname: "Fixture",
  suffix: "",
  email: "testa@maslogcare.test",
  phone: "09170000000",
  address: "Purok 3, Sampaguita St., Barangay Testville",
  addressDetails: { houseNumberOrPurok: "Purok 3", street: "Sampaguita St." },
  gender: "female",
  dateOfBirth: "1990-04-12T00:00:00.000Z",
};

const record: MasterResidentRecord = {
  masterResidentId: "TEST-A",
  missing: false,
  firstName: "Testa",
  middleName: "Sample",
  lastName: "Fixture",
  suffix: "",
  dateOfBirth: "1990-04-12",
  sex: "female",
  civilStatus: "single",
  barangay: "Testville",
  address: "Purok 3, Sampaguita Street",
  isActive: true,
};

const review = (overrides: Partial<MasterListReview> = {}): MasterListReview => ({
  checked: true,
  outcome: "matched",
  reasons: [],
  checkedAt: "2026-10-02T00:00:00.000Z",
  candidates: [record],
  linkedRecord: null,
  verificationMethod: "admin_review",
  ...overrides,
});

describe("describeOutcome", () => {
  it("says older registrations were never checked", () => {
    assert.equal(describeOutcome(undefined).title, "Not checked against the master list");
    assert.equal(describeOutcome(review({ checked: false, outcome: null })).tone, "neutral");
  });

  it("reminds the admin that a match is not proof of identity", () => {
    const summary = describeOutcome(review());
    assert.equal(summary.tone, "match");
    assert.match(summary.body, /still check the ID/);
  });

  it("marks automatic verification separately from a pending match", () => {
    assert.equal(describeOutcome(review({ verificationMethod: "master_list" })).title, "Verified automatically");
  });

  it("flags every uncertain outcome for review", () => {
    for (const outcome of ["partial_match", "conflict", "multiple_matches", "already_linked"] as const) {
      assert.equal(describeOutcome(review({ outcome })).tone, "review", outcome);
    }
  });

  it("has a label for every reason", () => {
    assert.ok(Object.values(REASON_LABELS).every((label) => label.length > 0));
  });
});

describe("buildComparisonRows", () => {
  it("lines up the registration with the record", () => {
    const rows = buildComparisonRows(resident, record);
    assert.deepEqual(
      rows.map((row) => [row.label, row.submitted, row.record, row.differs]),
      [
        ["Name", "Testa Sample Fixture", "Testa Sample Fixture", false],
        ["Birth date", "April 12, 1990", "April 12, 1990", false],
        ["Sex", "Female", "Female", false],
        ["Purok and street", "Purok 3, Sampaguita St.", "Purok 3, Sampaguita Street", false],
      ]
    );
  });

  it("flags only the rows the server reported", () => {
    const rows = buildComparisonRows(resident, record, ["dob_differs", "suffix_differs"]);
    assert.deepEqual(
      rows.filter((row) => row.differs).map((row) => row.key),
      ["name", "dateOfBirth"]
    );
  });

  it("fills blanks instead of leaving empty cells", () => {
    const rows = buildComparisonRows({ ...resident, addressDetails: null, address: "" }, { ...record, address: "" });
    assert.equal(rows[3].submitted, "Not given");
    assert.equal(rows[3].record, "Not given");
  });
});

describe("formatCalendarDate", () => {
  it("never shifts a birth date across timezones", () => {
    assert.equal(formatCalendarDate("1990-04-12"), "April 12, 1990");
    assert.equal(formatCalendarDate("1990-04-12T00:00:00.000Z"), "April 12, 1990");
    assert.equal(formatCalendarDate("garbage"), "");
  });
});

describe("approvalLinkNote", () => {
  it("names the record a pending approval will link", () => {
    assert.equal(approvalLinkNote(review(), true), "Approving links this account to record TEST-A.");
  });

  it("stays quiet when nothing would be linked", () => {
    assert.equal(approvalLinkNote(review(), false), null);
    assert.equal(approvalLinkNote(review({ outcome: "conflict" }), true), null);
    assert.equal(approvalLinkNote(review({ verificationMethod: "master_list" }), true), null);
    assert.equal(approvalLinkNote(undefined, true), null);
  });
});
