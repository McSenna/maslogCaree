import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validateChangePassword } from "../changePasswordValidation.ts";

const valid = { currentPassword: "InitialPass123!", newPassword: "NewSecure456!", confirmPassword: "NewSecure456!" };

describe("validateChangePassword", () => {
  it("lets a valid change through", () => {
    assert.deepEqual(validateChangePassword(valid), {});
  });

  it("asks for the current password", () => {
    assert.equal(validateChangePassword({ ...valid, currentPassword: "  " }).currentPassword, "Current password is required.");
  });

  it("refuses a new password that breaks the rules", () => {
    const errors = validateChangePassword({ ...valid, newPassword: "weakpass", confirmPassword: "weakpass" });
    assert.match(errors.newPassword ?? "", /^Password must be 8 to 16 characters/);
  });

  it("refuses a new password longer than 16 characters", () => {
    const long = "NewSecure456!abcde";
    assert.match(validateChangePassword({ ...valid, newPassword: long, confirmPassword: long }).newPassword ?? "", /8 to 16/);
  });

  it("refuses reusing the current password", () => {
    const same = { ...valid, newPassword: valid.currentPassword, confirmPassword: valid.currentPassword };
    assert.equal(validateChangePassword(same).newPassword, "Your new password must be different from your current password.");
  });

  it("refuses a confirmation that does not match", () => {
    assert.equal(validateChangePassword({ ...valid, confirmPassword: "NewSecure457!" }).confirmPassword, "Passwords do not match.");
  });

  it("asks for the confirmation", () => {
    assert.equal(validateChangePassword({ ...valid, confirmPassword: "" }).confirmPassword, "Please confirm your new password.");
  });
});
