/**
 * Every word the change password flow shows, in one place, so a reviewed
 * translation can replace this object without touching a component.
 * Import-free: the unit tests load it with plain `node --test`.
 */
export const CHANGE_PASSWORD_STRINGS = {
  title: "Change password",
  subtitle: "Keep your account secure.",
  close: "Close",
  cancel: "Cancel",
  submit: "Change password",
  submitting: "Changing…",
  retry: "Try again",
  fields: {
    currentPassword: { label: "Current password", placeholder: "Enter current password" },
    newPassword: { label: "New password", placeholder: "Enter new password" },
    confirmPassword: { label: "Confirm new password", placeholder: "Re-enter new password" },
  },
  toggle: {
    show: (label: string) => `Show ${label.toLowerCase()}`,
    hide: (label: string) => `Hide ${label.toLowerCase()}`,
  },
  requirements: {
    title: "Your new password needs",
    differentFromCurrent: "Not the same as your current password",
    met: "met",
    notMet: "not met",
  },
  errors: {
    currentRequired: "Enter your current password.",
    newRequired: "Enter a new password.",
    confirmRequired: "Re-enter your new password to confirm it.",
    sameAsCurrent: "Choose a password that is different from your current one.",
    mismatch: "This does not match the new password. Check both and try again.",
    requirementsUnmet: "Your new password does not meet the requirements marked below yet.",
    currentIncorrect: "Your current password is incorrect. Check it and try again.",
    tooManyAttempts: (minutes: number | null) =>
      minutes === null
        ? "Too many attempts. Try again in a few minutes."
        : `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    unconfirmed:
      "We could not confirm your password change because the connection was interrupted. It may have gone through. Try again: if your current password is then refused, your new password is already active.",
    serverProblem:
      "The server ran into a problem before confirming the change. Try again: if your current password is then refused, your new password is already active.",
  },
  discard: {
    title: "Discard changes?",
    message: "The passwords you typed will be cleared.",
    keep: "Keep editing",
    confirm: "Discard",
  },
  success: {
    title: "Password updated",
    description: "Other devices signed in to this account were signed out.",
  },
} as const;

export type ChangePasswordStrings = typeof CHANGE_PASSWORD_STRINGS;
