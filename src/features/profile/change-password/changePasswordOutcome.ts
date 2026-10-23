// Relative `.ts` imports keep this loadable by `node --test`.
import type { NormalizedApiError } from "../../../utils/apiError/ApiError.ts";
import { ERROR_CODES, SESSION_ENDING_CODES } from "../../../utils/errorCodes.ts";

import type { ChangePasswordFormValues } from "./changePassword.types.ts";

/**
 * What the app may tell the user after a change attempt. Only a server answer
 * proves the password changed or stayed the same; without one the app says it
 * could not confirm either way.
 */
export type ChangePasswordOutcome =
  | { kind: "changed" }
  | { kind: "rejected"; field?: keyof ChangePasswordFormValues; message: string }
  | { kind: "unconfirmed"; message: string }
  | { kind: "sessionEnded" };

export const UNCONFIRMED_MESSAGE =
  "We could not confirm your password change because the connection was interrupted. It may have gone through. To check, sign out and sign in with your new password. If it is not accepted, your old password still works.";

// Proxies answer these without saying whether the API finished the request.
const GATEWAY_STATUSES = [502, 503, 504];

type FailureInput = Pick<NormalizedApiError, "message" | "code" | "status" | "isNetworkError" | "isTimeoutError" | "isAuthError">;

const rejectedField = (code: string, message: string): keyof ChangePasswordFormValues | undefined => {
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

/** A 2xx only counts when the body says so: an empty or foreign body proves nothing. */
export const outcomeForResponse = (body: unknown): ChangePasswordOutcome =>
  typeof body === "object" && body !== null && (body as { success?: unknown }).success === true
    ? { kind: "changed" }
    : { kind: "unconfirmed", message: UNCONFIRMED_MESSAGE };

export const outcomeForFailure = (error: FailureInput): ChangePasswordOutcome => {
  if (error.code === ERROR_CODES.REQUEST_CANCELLED) {
    return { kind: "unconfirmed", message: UNCONFIRMED_MESSAGE };
  }
  if (error.isAuthError || SESSION_ENDING_CODES.includes(error.code)) {
    return { kind: "sessionEnded" };
  }
  if (error.isNetworkError || error.isTimeoutError || error.status === undefined || GATEWAY_STATUSES.includes(error.status)) {
    return { kind: "unconfirmed", message: UNCONFIRMED_MESSAGE };
  }
  return { kind: "rejected", field: rejectedField(error.code, error.message), message: error.message };
};

/**
 * Lets one submission run at a time. A second press while one is in flight is
 * dropped, not queued: React state has not re-rendered the disabled button yet
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
