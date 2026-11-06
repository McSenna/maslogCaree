// Relative `.ts` imports keep this loadable by `node --test`.
import type { NormalizedApiError } from "../../../utils/apiError/ApiError.ts";
import { ERROR_CODES, SESSION_ENDING_CODES } from "../../../utils/errorCodes.ts";

import type { ChangePasswordField } from "./changePassword.types.ts";
import { CHANGE_PASSWORD_STRINGS as S } from "./changePasswordStrings.ts";
import { CHANGE_PASSWORD_FIELDS } from "./changePasswordValidation.ts";

/**
 * What the app may tell the user after a change attempt. Only a server answer
 * proves the password changed or stayed the same; without one the app says it
 * could not confirm either way.
 */
export type ChangePasswordOutcome =
  | { kind: "changed"; token?: string }
  | { kind: "rejected"; field?: ChangePasswordField; message: string }
  | { kind: "rateLimited"; message: string }
  | { kind: "failed"; message: string }
  | { kind: "unconfirmed"; message: string }
  | { kind: "sessionEnded" };

// Proxies answer these without saying whether the API finished the request.
const GATEWAY_STATUSES = [502, 503, 504];

type FailureInput = Pick<
  NormalizedApiError,
  "message" | "code" | "status" | "fieldErrors" | "retryAfter" | "isNetworkError" | "isTimeoutError" | "isAuthError"
>;

/** Older servers only send a message, so its wording is the fallback. */
const fieldFromMessage = (code: string, message: string): ChangePasswordField | undefined => {
  if (code === ERROR_CODES.INVALID_CREDENTIALS) return "currentPassword";
  if (code !== ERROR_CODES.VALIDATION_ERROR) return undefined;
  const lower = message.toLowerCase();
  // Before "current password": the reuse rule names the current password too.
  if (lower.includes("different")) return "newPassword";
  if (lower.includes("match")) return "confirmPassword";
  if (lower.includes("current password")) return "currentPassword";
  if (lower.includes("password")) return "newPassword";
  return undefined;
};

const rejectedField = (error: FailureInput): ChangePasswordField | undefined => {
  const tagged = CHANGE_PASSWORD_FIELDS.find((field) => error.fieldErrors?.[field]);
  return tagged ?? fieldFromMessage(error.code, error.message);
};

/** The server's policy text is the authority for policy failures; known codes get the app's own words. */
const rejectionMessage = (error: FailureInput, field: ChangePasswordField | undefined): string => {
  if (error.code === ERROR_CODES.INVALID_CREDENTIALS) return S.errors.currentIncorrect;
  return (field && error.fieldErrors?.[field]) || error.message;
};

/** Whole minutes left, rounded up so "1 minute" never means "a few seconds too early". */
export const minutesUntilRetry = (retryAfterSeconds: number | undefined): number | null =>
  typeof retryAfterSeconds === "number" && retryAfterSeconds > 0 ? Math.ceil(retryAfterSeconds / 60) : null;

/** A 2xx only counts when the body says so: an empty or foreign body proves nothing. */
export const outcomeForResponse = (body: unknown): ChangePasswordOutcome => {
  if (typeof body !== "object" || body === null || (body as { success?: unknown }).success !== true) {
    return { kind: "unconfirmed", message: S.errors.unconfirmed };
  }
  const token = (body as { token?: unknown }).token;
  return typeof token === "string" && token ? { kind: "changed", token } : { kind: "changed" };
};

export const outcomeForFailure = (error: FailureInput): ChangePasswordOutcome => {
  if (error.code === ERROR_CODES.REQUEST_CANCELLED) {
    return { kind: "unconfirmed", message: S.errors.unconfirmed };
  }
  if (error.isAuthError || SESSION_ENDING_CODES.includes(error.code)) {
    return { kind: "sessionEnded" };
  }
  if (error.isNetworkError || error.isTimeoutError || error.status === undefined || GATEWAY_STATUSES.includes(error.status)) {
    return { kind: "unconfirmed", message: S.errors.unconfirmed };
  }
  if (error.status === 429) {
    return { kind: "rateLimited", message: S.errors.tooManyAttempts(minutesUntilRetry(error.retryAfter)) };
  }
  if (error.status >= 500) {
    return { kind: "failed", message: S.errors.serverProblem };
  }
  const field = rejectedField(error);
  return { kind: "rejected", field, message: rejectionMessage(error, field) };
};

/**
 * Lets one submission run at a time. A second press while one is in flight is
 * dropped, not queued: React state has not re-rendered the busy button yet
 * when a fast double tap lands.
 */
export const createSubmitGate = () => {
  let busy = false;
  return async <T>(task: () => Promise<T>): Promise<T | undefined> => {
    if (busy) return undefined;
    busy = true;
    try {
      return await task();
    } finally {
      busy = false;
    }
  };
};
