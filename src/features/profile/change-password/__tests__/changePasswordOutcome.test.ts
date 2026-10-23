import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { NETWORK_MESSAGE, STATUS_MESSAGES, TIMEOUT_MESSAGE, build } from "../../../../utils/apiError/errorClassification.ts";
import { ERROR_CODES } from "../../../../utils/errorCodes.ts";
import {
  UNCONFIRMED_MESSAGE,
  createSubmitGate,
  outcomeForFailure,
  outcomeForResponse,
} from "../changePasswordOutcome.ts";

// Shaped exactly as normalizeApiError builds them for each server answer.
const serverAnswer = (status: number, code: string, message: string) => build({ status, code, message });

describe("outcomeForResponse", () => {
  it("reports a change only when the server says it succeeded", () => {
    assert.deepEqual(outcomeForResponse({ success: true, message: "Password changed successfully." }), { kind: "changed" });
  });

  it("cannot confirm a 2xx with an empty body", () => {
    assert.deepEqual(outcomeForResponse(""), { kind: "unconfirmed", message: UNCONFIRMED_MESSAGE });
    assert.deepEqual(outcomeForResponse(undefined), { kind: "unconfirmed", message: UNCONFIRMED_MESSAGE });
  });

  it("cannot confirm a 2xx whose body does not say success", () => {
    assert.equal(outcomeForResponse({ success: false }).kind, "unconfirmed");
    assert.equal(outcomeForResponse({ message: "ok" }).kind, "unconfirmed");
  });
});

describe("outcomeForFailure", () => {
  it("puts a wrong current password on the current password field", () => {
    const outcome = outcomeForFailure(serverAnswer(400, ERROR_CODES.INVALID_CREDENTIALS, "Current password is incorrect."));
    assert.deepEqual(outcome, { kind: "rejected", field: "currentPassword", message: "Current password is incorrect." });
  });

  it("puts a weak new password on the new password field with the server's rule", () => {
    const message = "Password must be at least 8 characters. Include at least one uppercase letter.";
    const outcome = outcomeForFailure(serverAnswer(400, ERROR_CODES.VALIDATION_ERROR, message));
    assert.deepEqual(outcome, { kind: "rejected", field: "newPassword", message });
  });

  it("puts a reused password on the new password field", () => {
    const message = "Your new password must be different from your current password.";
    const outcome = outcomeForFailure(serverAnswer(400, ERROR_CODES.VALIDATION_ERROR, message));
    assert.deepEqual(outcome, { kind: "rejected", field: "newPassword", message });
  });

  it("puts a missing current password on the current password field", () => {
    const message = "Current password is required.";
    const outcome = outcomeForFailure(serverAnswer(400, ERROR_CODES.VALIDATION_ERROR, message));
    assert.deepEqual(outcome, { kind: "rejected", field: "currentPassword", message });
  });

  it("puts a mismatched confirmation on the confirm field", () => {
    const outcome = outcomeForFailure(serverAnswer(400, ERROR_CODES.VALIDATION_ERROR, "Passwords do not match."));
    assert.deepEqual(outcome, { kind: "rejected", field: "confirmPassword", message: "Passwords do not match." });
  });

  it("reports a server error before the write as not changed, in the server's words", () => {
    const outcome = outcomeForFailure(serverAnswer(500, ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_MESSAGES[500]));
    assert.deepEqual(outcome, { kind: "rejected", field: undefined, message: STATUS_MESSAGES[500] });
  });

  it("reports a rate limit as not changed", () => {
    const message = "Too many requests from this device. Please wait before trying again.";
    assert.deepEqual(outcomeForFailure(serverAnswer(429, "OTP_RATE_LIMITED", message)), {
      kind: "rejected",
      field: undefined,
      message,
    });
  });

  it("hands a refused session to the sign-out flow instead of blaming the password", () => {
    const expired = serverAnswer(401, ERROR_CODES.TOKEN_EXPIRED, "Your session has expired. Please log in again.");
    assert.deepEqual(outcomeForFailure(expired), { kind: "sessionEnded" });
  });

  it("cannot confirm either way after a timeout", () => {
    const timeout = build({ message: TIMEOUT_MESSAGE, code: ERROR_CODES.TIMEOUT_ERROR, isTimeoutError: true });
    assert.deepEqual(outcomeForFailure(timeout), { kind: "unconfirmed", message: UNCONFIRMED_MESSAGE });
  });

  it("cannot confirm either way after the connection drops", () => {
    const lost = build({ message: NETWORK_MESSAGE, code: ERROR_CODES.NETWORK_ERROR, isNetworkError: true });
    assert.equal(outcomeForFailure(lost).kind, "unconfirmed");
  });

  it("cannot confirm either way when a gateway answers for the API", () => {
    for (const status of [502, 503, 504]) {
      const gateway = serverAnswer(status, ERROR_CODES.SERVICE_UNAVAILABLE, STATUS_MESSAGES[status]);
      assert.equal(outcomeForFailure(gateway).kind, "unconfirmed", `status ${status}`);
    }
  });

  it("never words an uncertain outcome as a failure or a success", () => {
    assert.doesNotMatch(UNCONFIRMED_MESSAGE, /not changed|was changed|successfully/i);
  });
});

describe("createSubmitGate", () => {
  it("drops a second submission while the first is in flight", async () => {
    const gate = createSubmitGate();
    let sends = 0;
    let release: () => void = () => {};
    const slowSend = () => {
      sends += 1;
      return new Promise<string>((resolve) => {
        release = () => resolve("answered");
      });
    };

    const first = gate(slowSend);
    const second = await gate(slowSend);
    release();

    assert.equal(second, undefined);
    assert.equal(await first, "answered");
    assert.equal(sends, 1);
  });

  it("opens again after a failed submission", async () => {
    const gate = createSubmitGate();
    await assert.rejects(gate(() => Promise.reject(new Error("offline"))));
    assert.equal(await gate(() => Promise.resolve("retried")), "retried");
  });
});
