import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { MedicalRecord } from "../../../../services/medicalRecordTypes";
import type { MasterlistDetail } from "../../../medicalRecordMasterlist/types";
import type { Checklist } from "../../types";
import { peopleFromMasterlist, peopleFromRecord } from "../vaccinationPeople.ts";

const baby = { _id: "TEST-BABY", name: "Test baby", dateOfBirth: "2026-04-01" };
const checklist = {
  baby: { ...baby, motherMasterResidentId: "TEST-MOTHER", temporaryName: true, scheduleVersion: "v1", age: { months: 1, days: 1, weeks: 4 } },
  mother: { masterResidentId: "TEST-MOTHER", name: "Test mother" },
  accountLinked: false,
  nextScheduledDate: null,
  nextProposedDate: "2026-11-12",
} as unknown as Checklist;
const record = (extra: Partial<MedicalRecord>): MedicalRecord => ({ _id: "TEST-RECORD", serviceType: "immunization", assessment: "", completedAt: "2026-06-20", ...extra });
const valueOf = (rows: { label: string; value: string }[], label: string) => rows.find((row) => row.label === label)?.value;

describe("peopleFromRecord", () => {
  it("labels a ledger record's parent as the mother and marks a temporary name", () => {
    const { parent, baby: child } = peopleFromRecord(record({ immunizationBabyId: baby }), checklist, "Signed in");
    assert.equal(parent.title, "Mother");
    assert.equal(valueOf(parent.rows, "Name"), "Test mother");
    assert.equal(valueOf(parent.rows, "Account"), "Not linked");
    assert.equal(valueOf(child.rows, "Name"), "Test baby (temporary name)");
    assert.equal(valueOf(child.rows, "Next visit"), "Proposed Nov 12, 2026, not reserved");
  });

  it("shows what the record holds while the ledger has not loaded", () => {
    const { parent, baby: child } = peopleFromRecord(record({ immunizationBabyId: baby }), null, "Signed in");
    assert.equal(valueOf(parent.rows, "Name"), "Signed in");
    assert.equal(valueOf(child.rows, "Date of birth"), "Apr 1, 2026");
    assert.equal(valueOf(child.rows, "Next visit"), undefined);
  });

  it("learns the baby of a visit record from the read checklist, with the program's state", () => {
    const linked = { ...checklist, medicalRecord: { _id: "TEST-PROGRAM", recordStatus: "in_progress", immunizationProgress: { administered: 2, total: 15 } } } as unknown as Checklist;
    const { parent, baby: child } = peopleFromRecord(record({ serviceDetails: { ledgerSummary: true } }), linked, "Signed in");
    assert.equal(parent.title, "Mother");
    assert.equal(valueOf(child.rows, "Baby ID"), "TEST-BABY");
    assert.equal(valueOf(child.rows, "Program status"), "In progress · 2 of 15 doses administered");
  });

  it("calls an appointment's account holder the parent, not the mother", () => {
    const { parent, baby: child } = peopleFromRecord(
      record({ resident: { fullname: "Test parent" }, appointment: { _id: "TEST-APPT", childName: "Test child", childDateOfBirth: "2026-02-01" } }),
      null,
      "",
    );
    assert.equal(parent.title, "Parent");
    assert.equal(valueOf(parent.rows, "Name"), "Test parent");
    assert.equal(valueOf(child.rows, "Name"), "Test child");
  });

  it("never invents a baby for a record with none", () => {
    const { parent, baby: child } = peopleFromRecord(record({ resident: { fullname: "Test adult" } }), null, "");
    assert.equal(parent.title, "Patient");
    assert.deepEqual(child.rows, []);
    assert.equal(child.emptyText, "No baby is linked to this record.");
  });
});

describe("peopleFromMasterlist", () => {
  const detail = (immunizationBabyId?: MedicalRecord["immunizationBabyId"]) =>
    ({
      linkage: "unlinked",
      resident: { masterResidentId: "TEST-MOTHER", fullName: "", dateOfBirth: "", sex: "", purok: "", hasAccount: false },
      record: record({ immunizationBabyId }),
    }) as unknown as MasterlistDetail;

  it("reads Not recorded for blank identity values", () => {
    const { parent } = peopleFromMasterlist(detail(baby), null);
    assert.equal(parent.title, "Mother");
    assert.equal(valueOf(parent.rows, "Name"), "Not recorded");
    assert.equal(valueOf(parent.rows, "Sex"), "Not recorded");
    assert.equal(valueOf(parent.rows, "Purok"), undefined);
    assert.equal(valueOf(parent.rows, "Account"), "No account");
  });

  it("calls the person on a record with no baby the resident", () => {
    assert.equal(peopleFromMasterlist(detail(), null).parent.title, "Resident");
  });
});
