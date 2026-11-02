import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mayDeleteRecord } from "../recordDeletionAccess.ts";
import type { MasterlistRow } from "../types";

const row = { source: "manual_entry", serviceType: "bp_checking", createdById: "TEST-BHW", providerId: "TEST-DOCTOR" } as MasterlistRow;

describe("medical record deletion access", () => {
  it("preserves clinical ownership and keeps admin read-only", () => {
    assert.equal(mayDeleteRecord(row, {id:"TEST-BHW",role:"bhw"}), true);
    assert.equal(mayDeleteRecord(row, {id:"OTHER",role:"bhw"}), false);
    assert.equal(mayDeleteRecord(row, {id:"ADMIN",role:"admin"}), false);
    assert.equal(mayDeleteRecord(row, {id:"TEST-BHW",role:"resident"}), false);
    assert.equal(mayDeleteRecord(row, null), false);
    assert.equal(mayDeleteRecord({...row,createdById:"ADMIN"}, {id:"ADMIN",role:"admin"}), false);
  });
  it("allows only midwives to delete baby programs regardless of workflow status", () => {
    for (const workflowStatus of ["draft", "completed"] as const) {
      const program={...row,serviceType:"immunization",workflowStatus,baby:{_id:"TEST-BABY",name:"Test baby",dateOfBirth:"2026-01-01"}};
      assert.equal(mayDeleteRecord(program,{id:"MIDWIFE",role:"midwife"}),true);
      for (const role of ["admin","doctor","bhw","resident"]) assert.equal(mayDeleteRecord(program,{id:"TEST-BHW",role}),false);
    }
  });
  it("allows a completed appointment's provider within its service", () => {
    const appointment={...row,source:"appointment" as const,serviceType:"general_consultation"};
    assert.equal(mayDeleteRecord(appointment,{id:"TEST-DOCTOR",role:"doctor"}),true);
    assert.equal(mayDeleteRecord(appointment,{id:"OTHER",role:"doctor"}),false);
    assert.equal(mayDeleteRecord(appointment,{id:"ADMIN",role:"admin"}),false);
  });
});
