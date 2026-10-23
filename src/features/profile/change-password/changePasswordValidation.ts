// Relative `.ts` imports keep this loadable by `node --test`.
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  meetsAllPasswordRules,
} from "../../auth/forgotPassword/passwordRules.ts";

import type { ChangePasswordErrors, ChangePasswordFormValues } from "./changePassword.types.ts";

/** The same rules the server applies, checked first so a bad entry never leaves the device. */
export const validateChangePassword = (values: ChangePasswordFormValues): ChangePasswordErrors => {
  const errors: ChangePasswordErrors = {};

  if (!values.currentPassword.trim()) {
    errors.currentPassword = "Current password is required.";
  }

  if (!values.newPassword) {
    errors.newPassword = "New password is required.";
  } else if (values.currentPassword && values.newPassword === values.currentPassword) {
    errors.newPassword = "Your new password must be different from your current password.";
  } else if (!meetsAllPasswordRules(values.newPassword)) {
    errors.newPassword =
      `Password must be ${PASSWORD_MIN_LENGTH} to ${PASSWORD_MAX_LENGTH} characters with uppercase, lowercase, number, and special character.`;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your new password.";
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};
