import { toast } from "@/components/feedback/toast/toastStore";
import { getAuthErrorPresentation } from "@/utils/authErrorMessages";
import { ERROR_CODES } from "@/utils/errorCodes";
import { toastError } from "@/utils/errorToast/toastError";

import { LOGIN_MESSAGES } from "../webLogin/loginIdentifier";

const LOGIN_FAILED = "Couldn't log in";
const REFUSED_FALLBACK = "We couldn't sign you in. Please try again.";
const UNREACHABLE = "We couldn't reach MaslogCare. Check your connection, then try again.";

/**
 * A sign-in the server refused: one error toast that names the failure and
 * says what to do next. Every login surface reports through here, so the
 * card itself only ever shows field-level messages.
 */
export const toastLoginRefused = (result: { code?: string; error?: string }): void => {
  const message =
    result.code === ERROR_CODES.INVALID_CREDENTIALS
      ? LOGIN_MESSAGES.credentialsMismatch
      : getAuthErrorPresentation({ code: result.code, message: result.error }, LOGIN_FAILED, REFUSED_FALLBACK).message;
  toast.error(LOGIN_FAILED, message);
};

/** A sign-in that failed before the server could answer. */
export const toastLoginFailed = (error: unknown): void => toastError(LOGIN_FAILED, error, { fallback: UNREACHABLE });
