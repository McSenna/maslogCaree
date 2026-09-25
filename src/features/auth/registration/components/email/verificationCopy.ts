/**
 * User-facing copy for the registration e-mail code. Server messages are never
 * shown verbatim: each error code maps to a fixed sentence, so no internal
 * wording or technical detail reaches the screen.
 *
 * Deliberately import-free (codes are string literals matching
 * src/utils/errorCodes.ts) so it can be unit-tested with `node --test`.
 */

export type VerifyFailureKind = "incorrect" | "expired" | "locked" | "incomplete" | "retry";

export type VerifyFailure = {
  kind: VerifyFailureKind;
  message: string;
  /** Expired and locked codes cannot succeed again, so the boxes are cleared. */
  clearCode: boolean;
};

export const OTP_COPY = {
  incomplete: (length: number) => `Enter the ${length}-digit code.`,
  incorrect: "That code is incorrect. Check it and try again.",
  expired: "This code has expired. Request a new one.",
  locked: "Too many incorrect attempts. Request a new code.",
  verifyNetwork: "We couldn't verify the code. Check your connection and try again.",
  verifyGeneric: "We couldn't verify the code. Please try again.",
  emailTaken: "An account with this email already exists. Sign in or use a different email.",
  resent: "A new code has been sent.",
  resendNetwork: "We couldn't send a new code. Check your connection and try again.",
  resendGeneric: "We couldn't send a new code. Please try again in a moment.",
  resendCooldown: (seconds: number) =>
    `Please wait ${seconds} second${seconds === 1 ? "" : "s"} before requesting another code.`,
  rateLimited: "Too many requests. Please wait a few minutes and try again.",
  sendNetwork: "We couldn't send the code. Check your connection and try again.",
  sendGeneric: "We couldn't send the code. Please try again in a moment.",
  invalidEmail: "Enter a valid email address.",
  verified: "Email verified. You can continue with your registration.",
} as const;

const NETWORK_CODES = new Set(["NETWORK_ERROR", "TIMEOUT_ERROR", "REQUEST_CANCELLED"]);
const RATE_LIMIT_CODES = new Set(["OTP_RATE_LIMITED", "RATE_LIMIT_EXCEEDED"]);

export const describeVerifyFailure = (code: string | undefined, length: number): VerifyFailure => {
  switch (code) {
    case "OTP_INVALID":
      return { kind: "incorrect", message: OTP_COPY.incorrect, clearCode: false };
    case "OTP_EXPIRED":
      return { kind: "expired", message: OTP_COPY.expired, clearCode: true };
    case "OTP_MAX_ATTEMPTS":
      return { kind: "locked", message: OTP_COPY.locked, clearCode: true };
    case "INVALID_FORMAT":
    case "MISSING_FIELDS":
      return { kind: "incomplete", message: OTP_COPY.incomplete(length), clearCode: false };
    case "EMAIL_EXISTS":
      return { kind: "retry", message: OTP_COPY.emailTaken, clearCode: false };
    default:
      if (code && RATE_LIMIT_CODES.has(code)) {
        return { kind: "retry", message: OTP_COPY.rateLimited, clearCode: false };
      }
      return {
        kind: "retry",
        message: code && NETWORK_CODES.has(code) ? OTP_COPY.verifyNetwork : OTP_COPY.verifyGeneric,
        clearCode: false,
      };
  }
};

/**
 * Message for a failed send/resend. `retryAfter` comes from the server's
 * cooldown response and keeps the countdown honest when the client's timer drifted.
 */
export const describeSendFailure = (
  code: string | undefined,
  { isResend, retryAfter }: { isResend: boolean; retryAfter?: number }
): string => {
  if (code === "OTP_COOLDOWN" && retryAfter && retryAfter > 0) {
    return OTP_COPY.resendCooldown(retryAfter);
  }
  if (code && RATE_LIMIT_CODES.has(code)) return OTP_COPY.rateLimited;
  if (code === "EMAIL_EXISTS") return OTP_COPY.emailTaken;
  if (code === "INVALID_FORMAT" || code === "MISSING_FIELDS") return OTP_COPY.invalidEmail;

  const network = Boolean(code && NETWORK_CODES.has(code));
  if (isResend) return network ? OTP_COPY.resendNetwork : OTP_COPY.resendGeneric;
  return network ? OTP_COPY.sendNetwork : OTP_COPY.sendGeneric;
};

/**
 * `juan.delacruz@gmail.com` → `j***@gmail.com`. Keeps the domain so users can
 * tell which inbox to check, without repeating the whole address on screen.
 */
export const maskEmail = (email: string): string => {
  const trimmed = email.trim();
  const at = trimmed.lastIndexOf("@");
  if (at <= 0) return trimmed;

  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  return `${local[0]}***@${domain}`;
};

/** "0:45" for the resend countdown. */
export const formatCountdown = (seconds: number): string => {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
};
