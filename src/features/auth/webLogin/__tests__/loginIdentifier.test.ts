import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { LOGIN_MESSAGES, checkIdentifier, checkPassword } from "../loginIdentifier.ts";

describe("checkIdentifier", () => {
  it("asks for a value when the field is empty", () => {
    for (const raw of ["", "   "]) {
      assert.deepEqual(checkIdentifier(raw), { ok: false, message: LOGIN_MESSAGES.identifierRequired });
    }
  });

  it("accepts local and international PH mobile numbers and returns the 09 form", () => {
    for (const raw of ["09171234567", "0917 123 4567", "0917-123-4567", "+639171234567", " +63 917 123 4567 "]) {
      assert.deepEqual(checkIdentifier(raw), { ok: true, kind: "mobile", value: "09171234567" }, raw);
    }
  });

  it("explains the 11-digit format for short or malformed numbers", () => {
    for (const raw of ["0917123456", "0917 123", "091712345678", "639171234567", "12345678901"]) {
      assert.deepEqual(checkIdentifier(raw), { ok: false, message: LOGIN_MESSAGES.mobileLength }, raw);
    }
  });

  it("accepts a well-formed email address", () => {
    assert.deepEqual(checkIdentifier(" juan@email.com "), { ok: true, kind: "email", value: "juan@email.com" });
  });

  it("shows an example for malformed email addresses", () => {
    for (const raw of ["juan", "juan@", "juan@email", "juan@email.c", "juan dela@email.com"]) {
      assert.deepEqual(checkIdentifier(raw), { ok: false, message: LOGIN_MESSAGES.emailFormat }, raw);
    }
  });
});

describe("checkPassword", () => {
  it("only requires a value", () => {
    assert.equal(checkPassword(""), LOGIN_MESSAGES.passwordRequired);
    assert.equal(checkPassword(" "), null);
  });
});
