import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ChangePasswordFormAction, ChangePasswordFormState } from "../changePasswordFormState.ts";
import { INITIAL_FORM_STATE, changePasswordFormReducer, hasChangePasswordInput } from "../changePasswordFormState.ts";
import { CHANGE_PASSWORD_STRINGS as S } from "../changePasswordStrings.ts";

const run = (...actions: ChangePasswordFormAction[]): ChangePasswordFormState =>
  actions.reduce(changePasswordFormReducer, INITIAL_FORM_STATE);

const type = (field: "currentPassword" | "newPassword" | "confirmPassword", text: string): ChangePasswordFormAction => ({
  type: "change",
  field,
  text,
});

describe("checking on blur", () => {
  it("says nothing when an untouched field loses focus", () => {
    assert.deepEqual(run({ type: "blur", field: "currentPassword" }).errors, {});
  });

  it("checks a typed field when it loses focus", () => {
    const state = run(type("newPassword", "short"), { type: "blur", field: "newPassword" });
    assert.equal(state.errors.newPassword, S.errors.requirementsUnmet);
  });

  it("checks an emptied field on blur", () => {
    const state = run(type("currentPassword", "a"), type("currentPassword", ""), { type: "blur", field: "currentPassword" });
    assert.equal(state.errors.currentPassword, S.errors.currentRequired);
  });

  it("does not show an error while the user is still typing a fresh field", () => {
    assert.deepEqual(run(type("newPassword", "s")).errors, {});
  });
});

describe("re-checking on every keystroke after an error", () => {
  it("clears a shown error as soon as the field becomes valid", () => {
    const state = run(type("newPassword", "short"), { type: "blur", field: "newPassword" }, type("newPassword", "NewSecure456!"));
    assert.equal(state.errors.newPassword, undefined);
  });

  it("switches a shown error to the reuse message when the new password becomes the current one", () => {
    const state = run(type("currentPassword", "InitialPass123!"), type("newPassword", "abc"), { type: "blur", field: "newPassword" }, type("newPassword", "InitialPass123!"));
    assert.equal(state.errors.newPassword, S.errors.sameAsCurrent);
  });

  it("settles a confirmation error when the new password is changed to match it", () => {
    const state = run(
      type("newPassword", "NewSecure456!"),
      type("confirmPassword", "NewSecure457!"),
      { type: "blur", field: "confirmPassword" },
      type("newPassword", "NewSecure457!")
    );
    assert.equal(state.errors.confirmPassword, undefined);
  });

  it("settles 'same as current' when the current password is edited", () => {
    const state = run(
      type("currentPassword", "InitialPass123!"),
      type("newPassword", "InitialPass123!"),
      { type: "blur", field: "newPassword" },
      type("currentPassword", "InitialPass123")
    );
    assert.equal(state.errors.newPassword, undefined);
  });

  it("keeps a server error on another field while the user edits this one", () => {
    const state = run({ type: "serverError", field: "currentPassword", message: S.errors.currentIncorrect }, type("newPassword", "x"));
    assert.equal(state.errors.currentPassword, S.errors.currentIncorrect);
  });

  it("clears a server error once its own field is edited into a valid value", () => {
    const state = run(
      type("currentPassword", "WrongPass999!"),
      { type: "serverError", field: "currentPassword", message: S.errors.currentIncorrect },
      type("currentPassword", "InitialPass123!")
    );
    assert.equal(state.errors.currentPassword, undefined);
  });
});

describe("submit and reset", () => {
  it("shows every error at once on submit, typed or not", () => {
    const state = run({ type: "submit" });
    assert.deepEqual(Object.keys(state.errors), ["currentPassword", "newPassword", "confirmPassword"]);
  });

  it("clears values, errors and history on reset", () => {
    assert.deepEqual(run(type("newPassword", "x"), { type: "submit" }, { type: "reset" }), INITIAL_FORM_STATE);
  });

  it("knows whether anything was typed, for the discard prompt", () => {
    assert.equal(hasChangePasswordInput(INITIAL_FORM_STATE.values), false);
    assert.equal(hasChangePasswordInput(run(type("confirmPassword", " ")).values), true);
  });
});
