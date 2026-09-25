import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  OTP_COPY,
  describeSendFailure,
  describeVerifyFailure,
  formatCountdown,
  maskEmail,
} from "../verificationCopy.ts";

describe("verify failures", () => {
  it("keeps the digits after an incorrect code so one box can be fixed", () => {
    const failure = describeVerifyFailure("OTP_INVALID", 6);
    assert.equal(failure.kind, "incorrect");
    assert.equal(failure.message, "That code is incorrect. Check it and try again.");
    assert.equal(failure.clearCode, false);
  });

  it("clears the digits for an expired code", () => {
    const failure = describeVerifyFailure("OTP_EXPIRED", 6);
    assert.equal(failure.kind, "expired");
    assert.equal(failure.message, "This code has expired. Request a new one.");
    assert.equal(failure.clearCode, true);
  });

  it("clears the digits once attempts run out", () => {
    const failure = describeVerifyFailure("OTP_MAX_ATTEMPTS", 6);
    assert.equal(failure.kind, "locked");
    assert.equal(failure.clearCode, true);
  });

  it("asks for the full code when the server rejects the format", () => {
    assert.equal(describeVerifyFailure("INVALID_FORMAT", 6).message, "Enter the 6-digit code.");
  });

  it("keeps the digits and suggests checking the connection on network errors", () => {
    for (const code of ["NETWORK_ERROR", "TIMEOUT_ERROR"]) {
      const failure = describeVerifyFailure(code, 6);
      assert.equal(failure.clearCode, false);
      assert.equal(
        failure.message,
        "We couldn't verify the code. Check your connection and try again."
      );
    }
  });

  it("never passes unknown server codes or wording through", () => {
    const failure = describeVerifyFailure("INTERNAL_SERVER_ERROR", 6);
    assert.equal(failure.message, OTP_COPY.verifyGeneric);
    assert.equal(describeVerifyFailure(undefined, 6).message, OTP_COPY.verifyGeneric);
  });
});

describe("send and resend failures", () => {
  it("reports the server's cooldown in seconds", () => {
    assert.equal(
      describeSendFailure("OTP_COOLDOWN", { isResend: true, retryAfter: 12 }),
      "Please wait 12 seconds before requesting another code."
    );
    assert.equal(
      describeSendFailure("OTP_COOLDOWN", { isResend: true, retryAfter: 1 }),
      "Please wait 1 second before requesting another code."
    );
  });

  it("distinguishes resend network failures from first-send failures", () => {
    assert.equal(
      describeSendFailure("NETWORK_ERROR", { isResend: true }),
      "We couldn't send a new code. Check your connection and try again."
    );
    assert.equal(
      describeSendFailure("NETWORK_ERROR", { isResend: false }),
      "We couldn't send the code. Check your connection and try again."
    );
  });

  it("handles rate limits and taken addresses", () => {
    assert.equal(describeSendFailure("OTP_RATE_LIMITED", { isResend: true }), OTP_COPY.rateLimited);
    assert.equal(describeSendFailure("EMAIL_EXISTS", { isResend: false }), OTP_COPY.emailTaken);
  });

  it("falls back to a generic message for mail-service errors", () => {
    assert.equal(describeSendFailure("EMAIL_AUTH_FAILED", { isResend: true }), OTP_COPY.resendGeneric);
  });

  it("confirms a successful resend in plain words", () => {
    assert.equal(OTP_COPY.resent, "A new code has been sent.");
  });
});

describe("presentation helpers", () => {
  it("masks the local part of an e-mail address", () => {
    assert.equal(maskEmail("juan.delacruz@gmail.com"), "j***@gmail.com");
    assert.equal(maskEmail("  a@b.ph "), "a***@b.ph");
  });

  it("leaves text that is not an e-mail address alone", () => {
    assert.equal(maskEmail("not-an-email"), "not-an-email");
  });

  it("formats the resend countdown", () => {
    assert.equal(formatCountdown(60), "1:00");
    assert.equal(formatCountdown(45), "0:45");
    assert.equal(formatCountdown(5), "0:05");
    assert.equal(formatCountdown(-3), "0:00");
  });
});
