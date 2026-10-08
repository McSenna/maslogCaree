import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { EMAIL_MESSAGES, checkEmailAddress, emailFormatMessage } from "../emailAddress.ts";
import { checkLoginEmail } from "../../features/auth/webLogin/loginIdentifier.ts";
import { isValidEmailFormat } from "../../features/auth/registration/emailVerificationConfig.ts";
import { isValidEmail as resetAccepts } from "../../features/auth/forgotPassword/passwordRules.ts";

// Same cases as backend/tests/unit/emailAddress.test.js, so app and API agree.
const VALID = [
  "maria.santos@yahoo.com",
  "ana+clinic@outlook.ph",
  "o'neil@company.co",
  "JUAN.DelaCruz@DepEd.gov.ph",
  "user@sub.domain.museum",
  "user@xn--80ak6aa92e.com",
  "josé@correo.es",
  "  spaced@icloud.com  ",
  "a@b.co",
  "first_last-1@mail-server.org",
];

const INVALID: [string, string][] = [
  ["", "empty"],
  ["   ", "empty"],
  ["a b@c.com", "spaces"],
  ["juan.example.com", "missingAt"],
  ["a@@b.com", "extraAt"],
  ["a@b@c.com", "extraAt"],
  ["@yahoo.com", "missingLocal"],
  [".a@b.com", "localDots"],
  ["a.@b.com", "localDots"],
  ["a..b@c.com", "localDots"],
  ["a(b)@c.com", "localChars"],
  ["a@", "domainFormat"],
  ["a@b", "domainFormat"],
  ["a@.com", "domainFormat"],
  ["a@b..com", "domainFormat"],
  ["a@b.com.", "domainFormat"],
  ["a@-b.com", "domainFormat"],
  ["a@b.c", "domainFormat"],
  ["a@b.123", "domainFormat"],
  ["juan@email,com", "domainFormat"],
  [`${"a".repeat(65)}@b.com`, "tooLong"],
  [`a@${"b".repeat(250)}.com`, "tooLong"],
];

describe("checkEmailAddress", () => {
  it("accepts real addresses from any provider, trimmed but otherwise as typed", () => {
    for (const email of VALID) {
      const result = checkEmailAddress(email);
      assert.equal(result.ok, true, email);
      assert.equal(result.ok && result.value, email.trim(), email);
    }
  });

  it("rejects malformed addresses with the reason that names what to fix", () => {
    for (const [email, reason] of INVALID) {
      const result = checkEmailAddress(email);
      assert.equal(result.ok, false, email);
      assert.equal(!result.ok && result.reason, reason, email);
    }
  });

  it("never merges look-alike addresses", () => {
    const result = checkEmailAddress("j.uan+x@gmail.com");
    assert.equal(result.ok && result.value, "j.uan+x@gmail.com");
  });

  it("has a message for every reason, and none of them names a provider", () => {
    for (const [, reason] of INVALID) {
      const message = emailFormatMessage(reason as Parameters<typeof emailFormatMessage>[0]);
      assert.ok(message.length > 0, reason);
      assert.doesNotMatch(message, /gmail|yahoo|juan@/i, reason);
    }
    assert.equal(emailFormatMessage("missingAt"), EMAIL_MESSAGES.missingAt);
  });
});

describe("every sign-in and sign-up check uses the same rule", () => {
  it("login, registration code and password reset accept the same addresses", () => {
    for (const email of VALID) {
      assert.equal(checkLoginEmail(email).ok, true, `login: ${email}`);
      assert.equal(isValidEmailFormat(email), true, `registration: ${email}`);
      assert.equal(resetAccepts(email), true, `reset: ${email}`);
    }
  });

  it("and reject the same ones, login with the specific reason", () => {
    for (const [email, reason] of INVALID) {
      if (!email.trim()) continue; // An empty login field has its own "enter your email" message.
      const login = checkLoginEmail(email);
      assert.equal(login.ok, false, `login: ${email}`);
      assert.equal(!login.ok && login.message, emailFormatMessage(reason as Parameters<typeof emailFormatMessage>[0]), email);
      assert.equal(isValidEmailFormat(email), false, `registration: ${email}`);
      assert.equal(resetAccepts(email), false, `reset: ${email}`);
    }
  });
});
