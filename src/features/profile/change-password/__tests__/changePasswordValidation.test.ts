import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CHANGE_PASSWORD_STRINGS as S } from "../changePasswordStrings.ts";
import {
  passwordRequirementRules,
  unmetPasswordRules,
  validateChangePassword,
  validateChangePasswordField,
} from "../changePasswordValidation.ts";

// Test fixtures only, never real credentials.
const valid = { currentPassword: "InitialPass123!", newPassword: "NewSecure456!", confirmPassword: "NewSecure456!" };

describe("validateChangePassword", () => {
  it("lets a valid change through", () => {
    assert.deepEqual(validateChangePassword(valid), {});
  });

  it("requires all three fields", () => {
    assert.deepEqual(validateChangePassword({ currentPassword: "", newPassword: "", confirmPassword: "" }), {
      currentPassword: S.errors.currentRequired,
      newPassword: S.errors.newRequired,
      confirmPassword: S.errors.confirmRequired,
    });
  });

  it("never trims: a current password of spaces counts as typed", () => {
    assert.equal(validateChangePasswordField("currentPassword", { ...valid, currentPassword: "   " }), undefined);
  });

  it("accepts spaces and non-Latin characters in the new password", () => {
    const spaced = "Mga Bago 9 ñ!";
    assert.deepEqual(validateChangePassword({ ...valid, newPassword: spaced, confirmPassword: spaced }), {});
  });

  it("points a weak new password at the checklist", () => {
    const errors = validateChangePassword({ ...valid, newPassword: "weakpass", confirmPassword: "weakpass" });
    assert.equal(errors.newPassword, S.errors.requirementsUnmet);
  });

  it("refuses a new password shorter than 8 or longer than 16 characters", () => {
    for (const password of ["Ab1!xyz", "NewSecure456!abcde"]) {
      assert.equal(validateChangePasswordField("newPassword", { ...valid, newPassword: password }), S.errors.requirementsUnmet, password);
    }
  });

  it("accepts exactly 8 and exactly 16 characters", () => {
    for (const password of ["Ab1!wxyz", "Ab1!wxyzAb1!wxyz"]) {
      assert.equal(validateChangePasswordField("newPassword", { ...valid, newPassword: password }), undefined, password);
    }
  });

  it("refuses reusing the current password before listing rules", () => {
    const same = { ...valid, newPassword: valid.currentPassword, confirmPassword: valid.currentPassword };
    assert.equal(validateChangePassword(same).newPassword, S.errors.sameAsCurrent);
  });

  it("refuses a confirmation that does not match, case included", () => {
    assert.equal(validateChangePassword({ ...valid, confirmPassword: "newsecure456!" }).confirmPassword, S.errors.mismatch);
  });
});

describe("requirement checklist", () => {
  it("lists the policy rules plus not reusing the current password", () => {
    assert.deepEqual(passwordRequirementRules("x").map((rule) => rule.key), ["length", "case", "number", "symbol", "different"]);
  });

  it("marks the reuse rule unmet while empty or equal to the current password", () => {
    const different = passwordRequirementRules(valid.currentPassword).find((rule) => rule.key === "different");
    assert.equal(different?.test(""), false);
    assert.equal(different?.test(valid.currentPassword), false);
    assert.equal(different?.test(valid.newPassword), true);
  });

  it("reports unmet policy rules in checklist order", () => {
    assert.deepEqual(unmetPasswordRules("ABCDEFGH").map((rule) => rule.key), ["case", "number", "symbol"]);
  });
});
