// Relative `.ts` imports keep this loadable by `node --test`.
import { PASSWORD_RULES, type PasswordRule } from "../../auth/forgotPassword/passwordRules.ts";

import type {
  ChangePasswordField,
  ChangePasswordFieldErrors,
  ChangePasswordFormValues,
} from "./changePassword.types.ts";
import { CHANGE_PASSWORD_STRINGS as S } from "./changePasswordStrings.ts";

export const CHANGE_PASSWORD_FIELDS: readonly ChangePasswordField[] = ["currentPassword", "newPassword", "confirmPassword"];

/** The policy rules the new password has not met yet, in checklist order. */
export const unmetPasswordRules = (password: string): PasswordRule[] =>
  PASSWORD_RULES.filter((rule) => !rule.test(password));

/**
 * The same rules the server applies (backend/services/passwordReset/resetPolicy.js),
 * so a bad entry never leaves the device. Nothing is trimmed or normalized:
 * spaces and any Unicode character are legal password characters.
 */
export const validateChangePasswordField = (
  field: ChangePasswordField,
  values: ChangePasswordFormValues
): string | undefined => {
  if (field === "currentPassword") {
    return values.currentPassword ? undefined : S.errors.currentRequired;
  }

  if (field === "newPassword") {
    if (!values.newPassword) return S.errors.newRequired;
    if (values.currentPassword && values.newPassword === values.currentPassword) return S.errors.sameAsCurrent;
    return unmetPasswordRules(values.newPassword).length ? S.errors.requirementsUnmet : undefined;
  }

  if (!values.confirmPassword) return S.errors.confirmRequired;
  return values.confirmPassword === values.newPassword ? undefined : S.errors.mismatch;
};

export const validateChangePassword = (values: ChangePasswordFormValues): ChangePasswordFieldErrors => {
  const errors: ChangePasswordFieldErrors = {};
  for (const field of CHANGE_PASSWORD_FIELDS) {
    const message = validateChangePasswordField(field, values);
    if (message) errors[field] = message;
  }
  return errors;
};

/** Every requirement the checklist shows, the policy rules plus "not the current one". */
export const passwordRequirementRules = (currentPassword: string): PasswordRule[] => [
  ...PASSWORD_RULES,
  {
    key: "different",
    label: S.requirements.differentFromCurrent,
    test: (value) => value.length > 0 && value !== currentPassword,
  },
];
