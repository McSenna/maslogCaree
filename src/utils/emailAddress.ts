/**
 * The one email address rule for sign-in, sign-up and password reset. It
 * checks the shape of an address, never its provider: any domain with a
 * real-looking ending is accepted, and nothing is rewritten. Dots and "+tags"
 * are kept, so two addresses that only look alike are never treated as one.
 *
 * Mirrors backend/utils/validation/emailAddress.js; both share one test list.
 * Import-free so `node --test` can load it.
 */

export type EmailProblem =
  | "empty"
  | "spaces"
  | "tooLong"
  | "missingAt"
  | "extraAt"
  | "missingLocal"
  | "localDots"
  | "localChars"
  | "domainFormat";

export type EmailCheck = { ok: true; value: string } | { ok: false; reason: EmailProblem };

/** Each message says what to fix; none of them asks for a particular provider. */
export const EMAIL_MESSAGES: Record<EmailProblem, string> = {
  empty: "Enter your email address.",
  spaces: "Email addresses can't contain spaces. Remove them and try again.",
  tooLong: "That email address is too long. Check what you entered.",
  missingAt: 'Add the "@" and your email provider, for example name@provider.com.',
  extraAt: 'An email address has only one "@". Check what you entered.',
  missingLocal: 'Add your name or username before the "@".',
  localDots: 'Check the dots before the "@". A dot can\'t come first, last, or right after another dot.',
  localChars: 'The part before the "@" has a character email addresses can\'t use, like a comma or bracket.',
  domainFormat: 'Check the part after the "@". It should be your provider\'s address, like provider.com or school.edu.ph.',
};

const MAX_ADDRESS = 254;
const MAX_LOCAL = 64;
const MAX_LABEL = 63;
// Characters an unquoted local part may not contain (RFC 5322 specials).
const LOCAL_SPECIALS = /[(),:;<>[\]\\"]/u;
const DOMAIN_LABEL = /^[\p{L}\p{N}](?:[\p{L}\p{N}-]*[\p{L}\p{N}])?$/u;
const TOP_LEVEL = /^(?:[\p{L}]{2,}|xn--[a-z0-9-]+)$/iu;

const fail = (reason: EmailProblem): EmailCheck => ({ ok: false, reason });

const isDomain = (domain: string): boolean => {
  if (!domain || domain.length > 253) return false;
  const labels = domain.split(".");
  if (labels.length < 2) return false;
  if (!labels.every((label) => label.length <= MAX_LABEL && DOMAIN_LABEL.test(label))) return false;
  return TOP_LEVEL.test(labels[labels.length - 1]);
};

/** The address trimmed, case kept (the server lower-cases it where it stores and looks it up). */
export const checkEmailAddress = (input: string): EmailCheck => {
  const value = input.trim();
  if (!value) return fail("empty");
  if (/\s/u.test(value)) return fail("spaces");

  const parts = value.split("@");
  if (parts.length === 1) return fail("missingAt");
  if (parts.length > 2) return fail("extraAt");

  const [local, domain] = parts;
  if (value.length > MAX_ADDRESS || local.length > MAX_LOCAL) return fail("tooLong");
  if (!local) return fail("missingLocal");
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return fail("localDots");
  if (LOCAL_SPECIALS.test(local)) return fail("localChars");
  if (!isDomain(domain)) return fail("domainFormat");

  return { ok: true, value };
};

export const emailFormatMessage = (reason: EmailProblem): string => EMAIL_MESSAGES[reason];

export const isValidEmailAddress = (input: string): boolean => checkEmailAddress(input).ok;

/** The message for a typed address, or null when it is well formed. */
export const emailError = (input: string): string | null => {
  const check = checkEmailAddress(input);
  return check.ok ? null : emailFormatMessage(check.reason);
};
