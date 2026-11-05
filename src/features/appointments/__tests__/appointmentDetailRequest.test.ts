import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { requestAppointmentDetail, takeAppointmentDetailRequest } from "../appointmentDetailRequest.ts";

describe("appointment detail request", () => {
  it("is empty until a screen asks for an appointment", () => {
    assert.equal(takeAppointmentDetailRequest(), null);
  });
  it("hands the request over once, so a later visit opens the plain list", () => {
    requestAppointmentDetail("TEST-APPOINTMENT");
    assert.equal(takeAppointmentDetailRequest(), "TEST-APPOINTMENT");
    assert.equal(takeAppointmentDetailRequest(), null);
  });
  it("keeps only the latest request", () => {
    requestAppointmentDetail("TEST-FIRST");
    requestAppointmentDetail("TEST-SECOND");
    assert.equal(takeAppointmentDetailRequest(), "TEST-SECOND");
  });
});
