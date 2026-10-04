/**
 * Which failures reach the user as a toast, and in what words. Relative `.ts`
 * imports only, so `node --test` can load it.
 */

import type { NormalizedApiError } from "../apiError/ApiError.ts";
import { UNKNOWN_MESSAGE } from "../apiError/errorClassification.ts";
import { ERROR_CODES, SESSION_ENDING_CODES } from "../errorCodes.ts";

type ToastableError = Pick<NormalizedApiError, "message" | "code">;

/**
 * Failures the user should not hear about twice: a request the app cancelled
 * itself, and a refused session that the sign-out notice already explained.
 */
export const isAlreadyExplained = (error: ToastableError, sessionJustEnded: boolean): boolean =>
  error.code === ERROR_CODES.REQUEST_CANCELLED ||
  (sessionJustEnded && SESSION_ENDING_CODES.includes(error.code));

export type ReasonOptions = {
  /** Plain words for when the server gave no usable reason. */
  fallback?: string;
  /** The screen already shows the reason next to the form, so the toast only names what failed. */
  inline?: boolean;
  /** Replaces the server's reason, for refreshes: the news is that the screen may be behind, not why. */
  reason?: string;
};

export const errorToastReason = (error: ToastableError, { fallback, inline = false, reason }: ReasonOptions): string | undefined => {
  if (inline) return undefined;
  if (reason) return reason;
  const generic = error.code === ERROR_CODES.UNKNOWN_ERROR || error.message === UNKNOWN_MESSAGE;
  if (generic && fallback) return fallback;
  return error.message || fallback;
};

/**
 * Lets a notice through at most once per `windowMs` for each key, so a failure
 * that repeats in the background (every realtime reload, every reconnect) is
 * told once instead of every few seconds.
 */
export const createNoticeThrottle = (windowMs: number, now: () => number = Date.now) => {
  const lastShown = new Map<string, number>();
  return (key: string): boolean => {
    const at = now();
    const last = lastShown.get(key);
    if (last !== undefined && at - last < windowMs) return false;
    lastShown.set(key, at);
    return true;
  };
};

type Notice = { title: string; description: string };

const ACCOUNT_CLOSED: string[] = [
  ERROR_CODES.ACCOUNT_DISABLED,
  ERROR_CODES.ACCOUNT_NOT_FOUND,
  ERROR_CODES.ACCOUNT_UNVERIFIED,
  ERROR_CODES.ACCOUNT_SUSPENDED,
  ERROR_CODES.ACCOUNT_DEACTIVATED,
];

/** What the sign-out toast says when the server ends a session the user did not end. */
export const sessionEndNotice = (code: string): Notice => {
  if (ACCOUNT_CLOSED.includes(code)) {
    return {
      title: "You have been signed out",
      description: "This account can no longer sign in. Contact the barangay health center for help.",
    };
  }
  if (code === ERROR_CODES.RESIDENT_WEB_ACCESS_DENIED) {
    return {
      title: "You have been signed out",
      description: "Resident accounts sign in on the MaslogCare mobile app.",
    };
  }
  if (code === ERROR_CODES.PLATFORM_ACCESS_DENIED || code === ERROR_CODES.PLATFORM_CONTEXT_MISMATCH) {
    return {
      title: "You have been signed out",
      description: "This account cannot use MaslogCare on this device. Log in again on the right app.",
    };
  }
  return { title: "Your session ended", description: "Log in again to continue." };
};
