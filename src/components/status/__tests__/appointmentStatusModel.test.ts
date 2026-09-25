import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getStatusLabel, getStatusMeta } from "../appointmentStatusModel.ts";

describe("getStatusMeta", () => {
  it("labels a confirmed appointment as Approved for every audience", () => {
    assert.equal(getStatusLabel("confirmed", "staff"), "Approved");
    assert.equal(getStatusLabel("confirmed", "resident"), "Approved");
  });

  it("uses resident-friendly wording for an appointment being served", () => {
    assert.equal(getStatusLabel("processing", "staff"), "In Progress");
    assert.equal(getStatusLabel("processing", "resident"), "Being seen");
  });

  it("gives every known status except cancelled a non-neutral tone", () => {
    for (const status of ["pending", "confirmed", "rescheduled", "processing", "completed", "declined"]) {
      assert.notEqual(getStatusMeta(status).tone, "neutral", status);
    }
    assert.equal(getStatusMeta("cancelled").tone, "neutral");
  });

  it("normalises case and whitespace", () => {
    assert.equal(getStatusMeta("  COMPLETED ").key, "completed");
    assert.equal(getStatusLabel("  COMPLETED "), "Completed");
  });

  it("falls back to a readable neutral badge for unknown statuses", () => {
    assert.deepEqual(
      { label: getStatusLabel("in_queue"), tone: getStatusMeta("in_queue").tone },
      { label: "In Queue", tone: "neutral" }
    );
    assert.equal(getStatusLabel(undefined), "Unknown");
    assert.equal(getStatusLabel(""), "Unknown");
  });
});
