import { normalizeApiError, type NormalizedApiError } from "@/utils/apiErrorHandler";
import { ERROR_CODES } from "@/utils/errorCodes";

/**
 * Registration and OTP screens need more specific guidance than the generic
 * API message for a handful of codes — telling the user their account was
 * saved even though the email failed, for instance.
 *
 * This table was previously duplicated across RegistrationScreen and
 * OtpVerificationModal, which let the two screens drift apart.
 */
type AuthErrorCopy = { title: string; message: string };

const OVERRIDES: Record<string, AuthErrorCopy> = {
  [ERROR_CODES.EMAIL_SERVICE_LIMIT]: {
    title: "Email Service Unavailable",
    message:
      "Verification emails are temporarily unavailable due to server mail limits. Your registration has been saved. Please wait a moment and try resending the verification code.",
  },
  [ERROR_CODES.EMAIL_QUOTA_EXCEEDED]: {
    title: "Email Service Unavailable",
    message:
      "Verification emails are temporarily unavailable due to server mail limits. Your registration has been saved. Please wait a moment and try resending the verification code.",
  },
  [ERROR_CODES.EMAIL_CONFIGURATION_ERROR]: {
    title: "Service Unavailable",
    message:
      "Email verification is temporarily unavailable. Please contact the health center.",
  },
  [ERROR_CODES.OTP_MAX_ATTEMPTS]: {
    title: "Too Many Attempts",
    message:
      "Maximum verification attempts exceeded. Please close this window and register again.",
  },
  [ERROR_CODES.OTP_EXPIRED]: {
    title: "Code Expired",
    message: "Verification code has expired. Please request a new code below.",
  },
};

/**
 * Codes whose server message is already specific (it counts down remaining
 * attempts or seconds), so it is kept and only the dialog title is set.
 */
const TITLE_ONLY: Record<string, string> = {
  [ERROR_CODES.OTP_INVALID]: "Incorrect Code",
  [ERROR_CODES.OTP_COOLDOWN]: "Please Wait",
  [ERROR_CODES.OTP_RATE_LIMITED]: "Too Many Requests",
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: "Too Many Requests",
  [ERROR_CODES.EMAIL_EXISTS]: "Already Registered",
  [ERROR_CODES.ALREADY_VERIFIED]: "Already Registered",
  [ERROR_CODES.NETWORK_ERROR]: "No Connection",
  [ERROR_CODES.TIMEOUT_ERROR]: "Connection Timed Out",
};

export interface AuthErrorPresentation extends AuthErrorCopy {
  code: string;
  normalized: NormalizedApiError;
}

export function getAuthErrorPresentation(
  error: unknown,
  defaultTitle: string,
  defaultMessage: string
): AuthErrorPresentation {
  const normalized = normalizeApiError(error);
  const override = OVERRIDES[normalized.code];

  if (override) {
    return { ...override, code: normalized.code, normalized };
  }

  // Multiple field errors read better as a list than as a single summary line.
  const message =
    normalized.errors && normalized.errors.length > 1
      ? normalized.errors.join("\n")
      : normalized.message || defaultMessage;

  return {
    title: TITLE_ONLY[normalized.code] ?? defaultTitle,
    message,
    code: normalized.code,
    normalized,
  };
}
