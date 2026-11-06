import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { NETWORK_MESSAGE, STATUS_MESSAGES, TIMEOUT_MESSAGE, build } from "../../../../utils/apiError/errorClassification.ts";
import { ERROR_CODES } from "../../../../utils/errorCodes.ts";
import { CHANGE_PASSWORD_STRINGS as S } from "../changePasswordStrings.ts";
import {
  createSubmitGate,
  minutesUntilRetry,
  outcomeForFailure,
  outcomeForResponse,
} from "../changePasswordOutcome.ts";

// Shaped exactly as normalizeApiError builds them for each server answer.
const serverAnswer = (status: number, code: string, message: string, extra: { fieldErrors?: Record<string, string>; retryAfter?: number } = {}) =>
  build({ status, code, message, ...extra });

describe("outcomeForResponse", () => {
  it("reports a change only when the server says it succeeded", () => {
    assert.deepEqual(outcomeForResponse({ success: true, message: "Password changed successfully." }), { kind: "changed" });
  });

  it("carries the replacement token so this device stays signed in", () => {
    assert.deepEqual(outcomeForResponse({ success: true, message: "ok", token: "next.jwt.token" }), { kind: "changed", token: "next.jwt.token" });
  });

  it("ignores a token that is not a non-empty string", () => {
    assert.deepEqual(outcomeForResponse({ success: true, token: "" }), { kind: "changed" });
    assert.deepEqual(outcomeForResponse({ success: true, token: 42 }), { kind: "changed" });
  });

  it("cannot confirm a 2xx with an empty body", () => {
    assert.deepEqual(outcomeForResponse(""), { kind: "unconfirmed", message: S.errors.unconfirmed });
    assert.deepEqual(outcomeForResponse(undefined), { kind: "unconfirmed", message: S.errors.unconfirmed });
  });

  it("cannot confirm a 2xx whose body does not say success", () => {
    assert.equal(outcomeForResponse({ success: false }).kind, "unconfirmed");
    assert.equal(outcomeForResponse({ message: "ok" }).kind, "unconfirmed");
  });
});

describe("outcomeForFailure: field errors", () => {
  it("puts a wrong current password on the current field, in the app's words", () => {
    const outcome = outcomeForFailure(
      serverAnswer(400, ERROR_CODES.INVALID_CREDENTIALS, "Current password is incorrect.", {
        fieldErrors: { currentPassword: "Current password is incorrect." },
      })
    );
    assert.deepEqual(outcome, { kind: "rejected", field: "currentPassword", message: S.errors.currentIncorrect });
  });

  it("puts a policy failure on the new field with the server's rule text", () => {
    const message = "Password must contain a number.";
    const outcome = outcomeForFailure(serverAnswer(400, ERROR_CODES.VALIDATION_ERROR, message, { fieldErrors: { newPassword: message } }));
    assert.deepEqual(outcome, { kind: "rejected", field: "newPassword", message });
  });

  it("trusts the server's field tag over the wording", () => {
    const outcome = outcomeForFailure(
      serverAnswer(400, ERROR_CODES.VALIDATION_ERROR, "Choose another.", { fieldErrors: { confirmPassword: "Choose another." } })
    );
    assert.equal(outcome.kind === "rejected" && outcome.field, "confirmPassword");
  });

  describe("servers that send only a message", () => {
    const cases: [string, string, string][] = [
      [ERROR_CODES.INVALID_CREDENTIALS, "Current password is incorrect.", "currentPassword"],
      [ERROR_CODES.VALIDATION_ERROR, "Password must be at least 8 characters.", "newPassword"],
      [ERROR_CODES.VALIDATION_ERROR, "Your new password must be different from your current password.", "newPassword"],
      [ERROR_CODES.VALIDATION_ERROR, "Current password is required.", "currentPassword"],
      [ERROR_CODES.VALIDATION_ERROR, "Passwords do not match.", "confirmPassword"],
    ];
    for (const [code, message, field] of cases) {
      it(`maps "${message}" to ${field}`, () => {
        const outcome = outcomeForFailure(serverAnswer(400, code, message));
        assert.equal(outcome.kind === "rejected" && outcome.field, field);
      });
    }
  });

  it("shows an unplaceable refusal as a general message", () => {
    const outcome = outcomeForFailure(serverAnswer(403, ERROR_CODES.FORBIDDEN, STATUS_MESSAGES[403]));
    assert.deepEqual(outcome, { kind: "rejected", field: undefined, message: STATUS_MESSAGES[403] });
  });
});

describe("outcomeForFailure: everything else", () => {
  it("turns a 429 into a wait in whole minutes from Retry-After", () => {
    const outcome = outcomeForFailure(serverAnswer(429, "RATE_LIMITED", "Too many.", { retryAfter: 61 }));
    assert.deepEqual(outcome, { kind: "rateLimited", message: "Too many attempts. Try again in 2 minutes." });
  });

  it("says one minute, singular, and a few minutes when the wait is unknown", () => {
    assert.equal(S.errors.tooManyAttempts(minutesUntilRetry(30)), "Too many attempts. Try again in 1 minute.");
    assert.equal(S.errors.tooManyAttempts(minutesUntilRetry(undefined)), "Too many attempts. Try again in a few minutes.");
    assert.equal(minutesUntilRetry(0), null);
  });

  it("offers a retry for a server error instead of claiming nothing changed", () => {
    const outcome = outcomeForFailure(serverAnswer(500, ERROR_CODES.INTERNAL_SERVER_ERROR, STATUS_MESSAGES[500]));
    assert.deepEqual(outcome, { kind: "failed", message: S.errors.serverProblem });
  });

  it("hands a refused session to the sign-out flow instead of blaming the password", () => {
    for (const code of [ERROR_CODES.TOKEN_EXPIRED, ERROR_CODES.INVALID_TOKEN, ERROR_CODES.AUTHENTICATION_REQUIRED]) {
      assert.deepEqual(outcomeForFailure(serverAnswer(401, code, "Signed out.")), { kind: "sessionEnded" }, code);
    }
  });

  it("cannot confirm either way after a timeout, a lost connection or a cancelled request", () => {
    const timeout = build({ message: TIMEOUT_MESSAGE, code: ERROR_CODES.TIMEOUT_ERROR, isTimeoutError: true });
    const lost = build({ message: NETWORK_MESSAGE, code: ERROR_CODES.NETWORK_ERROR, isNetworkError: true });
    const cancelled = build({ message: "Cancelled.", code: ERROR_CODES.REQUEST_CANCELLED });
    for (const failure of [timeout, lost, cancelled]) {
      assert.deepEqual(outcomeForFailure(failure), { kind: "unconfirmed", message: S.errors.unconfirmed });
    }
  });

  it("cannot confirm either way when a gateway answers for the API", () => {
    for (const status of [502, 503, 504]) {
      const gateway = serverAnswer(status, ERROR_CODES.SERVICE_UNAVAILABLE, STATUS_MESSAGES[status]);
      assert.equal(outcomeForFailure(gateway).kind, "unconfirmed", `status ${status}`);
    }
  });

  it("never words an uncertain outcome as a failure or a success", () => {
    for (const message of [S.errors.unconfirmed, S.errors.serverProblem]) {
      assert.doesNotMatch(message, /not changed|was changed|successfully/i);
    }
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
