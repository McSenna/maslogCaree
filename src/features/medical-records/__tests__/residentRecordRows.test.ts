import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { MedicalRecord } from "../../../services/medicalRecordTypes";
import {
  babyPreviewRecord,
  isBabyPreview,
  providerLineOf,
  providerNameOf,
  rowsForPage,
  sourceLabelOf,
  totalWithBabies,
  visitDateOf,
  type BabyWithoutRecord,
} from "../residentRecordRows.ts";

const BABY: BabyWithoutRecord = { _id: "b1", name: "Fixture Newborn", temporaryName: false, dateOfBirth: "2026-01-02" };
const RECORD = {
  _id: "r1",
  serviceType: "bp_checking",
  assessment: "",
  completedAt: "2024-03-15T00:00:00.000Z",
  source: "historical_masterlist",
  providerName: "Fixture BHW",
  providerRole: "bhw",
} as MedicalRecord;
const NO_FILTERS = { service: "", range: "" };

describe("resident record rows", () => {
  it("leads the first page with babies that have no record yet", () => {
    const rows = rowsForPage(1, [RECORD], [BABY], NO_FILTERS, "");
    assert.deepEqual(rows.map((row) => row._id), ["baby-b1", "r1"]);
    assert.equal(totalWithBabies(1, [BABY], NO_FILTERS, ""), 2);
  });

  it("keeps them off later pages", () => {
    assert.deepEqual(rowsForPage(2, [RECORD], [BABY], NO_FILTERS, ""), [RECORD]);
  });

  it("leaves them out when a filter they cannot match is on, so the count agrees", () => {
    for (const [filters, search] of [
      [{ service: "bp_checking", range: "" }, ""],
      [{ service: "", range: "6m" }, ""],
      [NO_FILTERS, "fixture"],
    ] as const) {
      assert.deepEqual(rowsForPage(1, [RECORD], [BABY], filters, search), [RECORD]);
      assert.equal(totalWithBabies(1, [BABY], filters, search), 1);
    }
    assert.equal(rowsForPage(1, [], [BABY], { service: "immunization", range: "" }, "").length, 1);
  });

  it("marks a stand-in row and says what it lacks", () => {
    const preview = babyPreviewRecord(BABY);
    assert.equal(isBabyPreview(preview), true);
    assert.equal(isBabyPreview(RECORD), false);
    assert.equal(visitDateOf(preview), "No doses yet");
    assert.equal(providerLineOf(preview), "Not recorded");
  });

  it("describes a real record from its own fields", () => {
    assert.match(visitDateOf(RECORD), /15, 2024$/);
    assert.equal(providerLineOf(RECORD), "Fixture BHW (BHW)");
    assert.equal(providerNameOf(RECORD), "Fixture BHW");
    assert.equal(sourceLabelOf(RECORD), "Historical record");
    assert.equal(sourceLabelOf({ ...RECORD, source: undefined }), "Appointment");
  });
});
