// Kept free of `@/` imports so `node --test` can load it.
import { checkEmailAddress, emailFormatMessage } from "../../../utils/emailAddress.ts";
import { PASSWORD_MAX_LENGTH } from "../forgotPassword/passwordRules.ts";

export const LOGIN_MESSAGES = {
  emailRequired: "Enter your email address.",
  // People who signed in with a number before keep trying it; say plainly what to use instead.
  mobileNotAccepted: "Sign in with your email address. Mobile numbers can't be used to sign in.",
  passwordRequired: "Enter your password.",
  passwordTooLong: `Passwords have at most ${PASSWORD_MAX_LENGTH} characters. Check what you entered.`,
  // The server answers an unknown address and a wrong password the same way, so nobody can use
  // the login form to find out who has an account. This message covers both cases.
  credentialsMismatch:
    "We couldn't sign you in with that email address and password. Check both, reset your password, or create an account if you're new.",
} as const;

export type LoginEmailCheck = { ok: true; value: string } | { ok: false; message: string };

// Only digits and the separators people type between digit groups: "0917 123 4567", "+63 917...".
const LOOKS_LIKE_PHONE = /^\+?[\d\s().-]*\d[\d\s().-]*$/;

/** Sign-in takes an email address only. The address is sent exactly as typed, trimmed. */
export const checkLoginEmail = (raw: string): LoginEmailCheck => {
  const value = raw.trim();
  if (!value) return { ok: false, message: LOGIN_MESSAGES.emailRequired };
  if (LOOKS_LIKE_PHONE.test(value)) return { ok: false, message: LOGIN_MESSAGES.mobileNotAccepted };

  // Any provider is fine; only the shape of the address is checked.
  const email = checkEmailAddress(value);
  return email.ok ? { ok: true, value: email.value } : { ok: false, message: emailFormatMessage(email.reason) };
};

export const checkPassword = (password: string): string | null => {
  if (!password) return LOGIN_MESSAGES.passwordRequired;
  // Inputs stop at the limit, but a script or autofill can still set a longer value.
  if (password.length > PASSWORD_MAX_LENGTH) return LOGIN_MESSAGES.passwordTooLong;
  return null;
};
