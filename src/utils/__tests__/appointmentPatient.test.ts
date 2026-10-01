import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  appointmentPatientBirthDate,
  appointmentPatientName,
  childCaption,
  formatChildBirthDate,
  guardianLine,
  isChildVisit,
} from "../appointmentPatient.ts";
import { isWeeklyService } from "../serviceDays.ts";

const parent = { fullname: "Test Parent", dateOfBirth: "1990-01-01" };

describe("appointment patient", () => {
  it("names the child for an immunization and the account holder otherwise", () => {
    assert.equal(appointmentPatientName({ childName: "Test Child", resident: parent }), "Test Child");
    assert.equal(appointmentPatientName({ resident: parent }), "Test Parent");
    assert.equal(appointmentPatientName({}), "Unnamed patient");
  });

  it("uses the child's birth date for the patient's age", () => {
    assert.equal(appointmentPatientBirthDate({ childName: "Test Child", childDateOfBirth: "2025-01-10", resident: parent }), "2025-01-10");
    assert.equal(appointmentPatientBirthDate({ resident: parent }), "1990-01-01");
  });

  it("adds the parent line only for a child's visit", () => {
    assert.equal(guardianLine({ childName: "Test Child", resident: parent }), "Parent: Test Parent");
    assert.equal(guardianLine({ resident: parent }), null);
    assert.equal(isChildVisit({ childName: "  " }), false);
  });

  it("captions a child's visit with birth date and parent for staff", () => {
    // Stored as Manila midnight, which is 16:00 UTC the day before.
    assert.equal(formatChildBirthDate("2025-01-09T16:00:00.000Z"), "Jan 10, 2025");
    assert.equal(
      childCaption({ childName: "Test Child", childDateOfBirth: "2025-01-09T16:00:00.000Z", resident: parent }),
      "Born Jan 10, 2025 · Parent: Test Parent"
    );
    assert.equal(childCaption({ resident: parent }), null);
  });

  it("knows which service has its own weekly schedule", () => {
    assert.equal(isWeeklyService("immunization"), true);
    for (const key of ["general_checkup", "consultation", "prenatal", "bp_checking", null]) assert.equal(isWeeklyService(key), false);
  });
});
