// Kept import-free so `node --test` can load it without the `@/` alias.

export const LOGIN_MESSAGES = {
  identifierRequired: "Enter your email or mobile number.",
  mobileLength: "Mobile numbers have 11 digits, like 0917 123 4567.",
  emailFormat: "Check your email address. It should look like juan@email.com.",
  passwordRequired: "Enter your password.",
  credentialsMismatch:
    "That email or mobile number and password don't match. Check both and try again, or reset your password.",
} as const;

export type IdentifierCheck =
  | { ok: true; kind: "email" | "mobile"; value: string }
  | { ok: false; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Separators people type between digit groups: "0917 123 4567", "0917-123-4567", "(0917) 123.4567".
const MOBILE_SEPARATORS = /[\s().-]/g;
const LOOKS_LIKE_PHONE = /^\+?[\d\s().-]+$/;
const LOCAL_MOBILE = /^09\d{9}$/;
const INTERNATIONAL_MOBILE = /^\+639\d{9}$/;

/**
 * Accepts an email address or a Philippine mobile number (09XXXXXXXXX or
 * +639XXXXXXXXX). Mobile numbers come back in the local 09 form.
 */
export const checkIdentifier = (raw: string): IdentifierCheck => {
  const value = raw.trim();
  if (!value) return { ok: false, message: LOGIN_MESSAGES.identifierRequired };

  if (LOOKS_LIKE_PHONE.test(value)) {
    const digits = value.replace(MOBILE_SEPARATORS, "");
    if (LOCAL_MOBILE.test(digits)) return { ok: true, kind: "mobile", value: digits };
    if (INTERNATIONAL_MOBILE.test(digits)) {
      return { ok: true, kind: "mobile", value: `0${digits.slice(3)}` };
    }
    return { ok: false, message: LOGIN_MESSAGES.mobileLength };
  }

  if (EMAIL_PATTERN.test(value)) return { ok: true, kind: "email", value };
  return { ok: false, message: LOGIN_MESSAGES.emailFormat };
};

export const checkPassword = (password: string): string | null =>
  password ? null : LOGIN_MESSAGES.passwordRequired;
