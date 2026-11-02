import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mayWriteMedicalRecords } from "../recordWriteAccess.ts";

describe("medical record write access", () => {
  it("keeps administrators and nonclinical viewers read-only", () => {
    for (const role of ["admin", "resident", "unknown", ""]) {
      assert.equal(mayWriteMedicalRecords({ role }), false);
    }
    assert.equal(mayWriteMedicalRecords(null), false);
    assert.equal(mayWriteMedicalRecords(undefined), false);
  });
  it("retains clinical staff write access", () => {
    for (const role of ["doctor", "midwife", "bhw"]) {
      assert.equal(mayWriteMedicalRecords({ role }), true);
    }
  });
});
