import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { EMAIL_MESSAGES } from "../../../../utils/emailAddress.ts";
import { LOGIN_MESSAGES, checkLoginEmail, checkPassword } from "../loginIdentifier.ts";

describe("checkLoginEmail", () => {
  it("asks for an email address when the field is empty", () => {
    for (const raw of ["", "   "]) {
      assert.deepEqual(checkLoginEmail(raw), { ok: false, message: LOGIN_MESSAGES.emailRequired });
    }
  });

  it("refuses a mobile number in any format and says sign-in takes an email address", () => {
    const numbers = ["09171234567", "0917 123 4567", "0917-123-4567", "(0917) 123.4567", "+639171234567", " +63 917 123 4567 ", "0917123456"];
    for (const raw of numbers) {
      assert.deepEqual(checkLoginEmail(raw), { ok: false, message: LOGIN_MESSAGES.mobileNotAccepted }, raw);
    }
  });

  it("never mentions mobile numbers except to say they are not accepted", () => {
    for (const [key, message] of Object.entries(LOGIN_MESSAGES)) {
      if (key === "mobileNotAccepted") continue;
      assert.doesNotMatch(message, /mobile|phone/i, key);
    }
  });

  it("accepts a well-formed email address", () => {
    assert.deepEqual(checkLoginEmail(" juan@email.com "), { ok: true, value: "juan@email.com" });
  });

  it("says what to fix in a malformed email address", () => {
    const cases: [string, string][] = [
      ["juan", EMAIL_MESSAGES.missingAt],
      ["juan@", EMAIL_MESSAGES.domainFormat],
      ["juan@email", EMAIL_MESSAGES.domainFormat],
      ["juan@email.c", EMAIL_MESSAGES.domainFormat],
      ["juan dela@email.com", EMAIL_MESSAGES.spaces],
    ];
    for (const [raw, message] of cases) {
      assert.deepEqual(checkLoginEmail(raw), { ok: false, message }, raw);
    }
  });

  it("accepts an address from any provider exactly as typed", () => {
    for (const raw of ["maria@yahoo.com", "Ana.Cruz+clinic@outlook.ph", "staff@deped.gov.ph"]) {
      assert.deepEqual(checkLoginEmail(raw), { ok: true, value: raw }, raw);
    }
  });
});

describe("checkPassword", () => {
  it("requires a value", () => {
    assert.equal(checkPassword(""), LOGIN_MESSAGES.passwordRequired);
    assert.equal(checkPassword(" "), null);
  });

  it("accepts up to 16 characters of letters, numbers, and symbols", () => {
    assert.equal(checkPassword("Abc123!@Abc123!@"), null);
    assert.equal(checkPassword("Abc123!@Abc123!@x"), LOGIN_MESSAGES.passwordTooLong);
  });
});
