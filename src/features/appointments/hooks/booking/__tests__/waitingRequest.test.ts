import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { findWaitingDoctorRequest } from "../waitingRequest.ts";

describe("findWaitingDoctorRequest", () => {
  it("finds a general checkup or consultation still waiting in the queue", () => {
    const waiting = { status: "pending", consultationType: "consultation" };
    assert.equal(findWaitingDoctorRequest([{ status: "completed", consultationType: "general_checkup" }, waiting]), waiting);
  });

  it("ignores doctor visits that already have a time, or have ended", () => {
    const rows = ["confirmed", "rescheduled", "processing", "completed", "cancelled", "declined"].map((status) => ({
      status,
      consultationType: "general_checkup",
    }));
    assert.equal(findWaitingDoctorRequest(rows), null);
  });

  it("ignores waiting visits of services the resident books with a time", () => {
    const rows = ["bp_checking", "prenatal", "immunization"].map((consultationType) => ({ status: "pending", consultationType }));
    assert.equal(findWaitingDoctorRequest(rows), null);
  });

  it("reads the status the way the status badge does", () => {
    assert.ok(findWaitingDoctorRequest([{ status: " PENDING ", consultationType: "general_checkup" }]));
    assert.equal(findWaitingDoctorRequest([]), null);
  });
});
