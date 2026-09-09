import { ERROR_CODES, SESSION_ENDING_CODES } from "@/utils/errorCodes";

/**
 * The single place where any failure — Axios, network, timeout, a malformed
 * response, or a plain runtime throw — becomes something the UI can render.
 *
 * Every screen and hook consumes errors through this module, so raw strings
 * like "Network Error", "timeout of 15000ms exceeded" or "Request failed with
 * status code 500" never reach a patient or a health worker.
 */

export interface NormalizedApiError {
  /** Safe, user-facing message. Always present and never a raw library string. */
  message: string;
  /** Machine-readable code for branching. */
  code: string;
  /** HTTP status, when the request reached the server. */
  status?: number;
  /** Field-level validation messages, when the server sent them. */
  errors?: string[];
  /** Seconds to wait, sent with cooldown/rate-limit responses. */
  retryAfter?: number;
  isNetworkError: boolean;
  isTimeoutError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;
}

/**
 * Error subclass carrying the normalized fields.
 *
 * It extends Error deliberately: existing call sites do
 * `e instanceof Error ? e.message : fallback`, and they keep working while
 * gaining `.code` and `.status`.
 */
export class ApiError extends Error implements NormalizedApiError {
  code: string;
  status?: number;
  errors?: string[];
  retryAfter?: number;
  isNetworkError: boolean;
  isTimeoutError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;

  constructor(normalized: NormalizedApiError) {
    super(normalized.message);
    this.name = "ApiError";
    this.message = normalized.message;
    this.code = normalized.code;
    this.status = normalized.status;
    this.errors = normalized.errors;
    this.retryAfter = normalized.retryAfter;
    this.isNetworkError = normalized.isNetworkError;
    this.isTimeoutError = normalized.isTimeoutError;
    this.isAuthError = normalized.isAuthError;
    this.isValidationError = normalized.isValidationError;
  }
}

/**
 * Fallback copy per HTTP status, used when the server could not supply a
 * message — an HTML error page from a proxy, or a truncated response.
 */
const STATUS_MESSAGES: Record<number, string> = {
  400: "The information sent was not accepted. Please check your entries and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested information could not be found.",
  409: "This action conflicts with existing information. Please refresh and try again.",
  413: "The information you submitted is too large. Please use a smaller photo or shorter text.",
  422: "Please review the information you entered.",
  429: "Too many requests. Please try again shortly.",
  500: "The server ran into a problem. Please try again later.",
  502: "The server is unreachable right now. Please try again later.",
  503: "The service is temporarily unavailable. Please try again later.",
  504: "The server took too long to respond. Please try again.",
};

const NETWORK_MESSAGE =
  "Unable to connect to the server. Please check your connection and try again.";
const TIMEOUT_MESSAGE = "The request took too long. Please try again.";
const UNKNOWN_MESSAGE = "An unexpected error occurred. Please try again.";

const codeForStatus = (status: number): string => {
  if (status === 401) return ERROR_CODES.AUTHENTICATION_REQUIRED;
  if (status === 403) return ERROR_CODES.FORBIDDEN;
  if (status === 404) return ERROR_CODES.NOT_FOUND;
  if (status === 409) return ERROR_CODES.CONFLICT;
  if (status === 413) return ERROR_CODES.PAYLOAD_TOO_LARGE;
  if (status === 422) return ERROR_CODES.VALIDATION_ERROR;
  if (status === 429) return ERROR_CODES.RATE_LIMIT_EXCEEDED;
  if (status === 503) return ERROR_CODES.SERVICE_UNAVAILABLE;
  if (status >= 500) return ERROR_CODES.INTERNAL_SERVER_ERROR;
  if (status >= 400) return ERROR_CODES.VALIDATION_ERROR;
  return ERROR_CODES.UNKNOWN_ERROR;
};

const VALIDATION_CODES: string[] = [
  ERROR_CODES.VALIDATION_ERROR,
  ERROR_CODES.MISSING_FIELDS,
  ERROR_CODES.INVALID_FORMAT,
  ERROR_CODES.INVALID_PHOTO,
];

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Detects a NormalizedApiError that is being passed back in. Normalizing is
 * idempotent so helpers like isOfflineError() can be called on a result that
 * has already been through here without losing its classification.
 */
const isNormalized = (value: unknown): value is NormalizedApiError =>
  isPlainObject(value) &&
  typeof value.message === "string" &&
  typeof value.code === "string" &&
  typeof value.isNetworkError === "boolean" &&
  typeof value.isTimeoutError === "boolean";

/**
 * Names of faults that are always programming bugs. Their messages describe
 * internals ("Cannot read properties of undefined") and must never be shown.
 */
const RUNTIME_FAULT_NAMES = new Set([
  "TypeError",
  "ReferenceError",
  "RangeError",
  "SyntaxError",
  "EvalError",
  "URIError",
]);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/**
 * Rejects text that is technically a string but is not a message — an HTML
 * error page, or a raw library string that should never be shown.
 */
const RAW_LIBRARY_MESSAGE =
  /^(Network Error|Request failed with status code \d+|timeout of \d+ms exceeded|<!DOCTYPE|<html)/i;

const isUsableMessage = (value: unknown): value is string =>
  isNonEmptyString(value) && !RAW_LIBRARY_MESSAGE.test(value.trim());

function build(partial: Partial<NormalizedApiError> & { message: string; code: string }): NormalizedApiError {
  const status = partial.status;
  return {
    message: partial.message,
    code: partial.code,
    status,
    errors: partial.errors,
    retryAfter: partial.retryAfter,
    isNetworkError: partial.isNetworkError ?? false,
    isTimeoutError: partial.isTimeoutError ?? false,
    isAuthError: partial.isAuthError ?? (status === 401 || SESSION_ENDING_CODES.includes(partial.code)),
    isValidationError:
      partial.isValidationError ?? (status === 422 || VALIDATION_CODES.includes(partial.code)),
  };
}

/**
 * Converts anything thrown into a NormalizedApiError.
 *
 * Accepts an Axios error, an already-normalized ApiError, a plain Error, or an
 * unknown value, so it is safe to call from any catch block.
 */
export function normalizeApiError(error: unknown): NormalizedApiError {
  if (error == null) {
    return build({ message: UNKNOWN_MESSAGE, code: ERROR_CODES.UNKNOWN_ERROR });
  }

  // Already normalized — pass it through rather than re-deriving.
  if (isNormalized(error) && !(error instanceof Error)) {
    return error;
  }

  if (error instanceof ApiError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      errors: error.errors,
      retryAfter: error.retryAfter,
      isNetworkError: error.isNetworkError,
      isTimeoutError: error.isTimeoutError,
      isAuthError: error.isAuthError,
      isValidationError: error.isValidationError,
    };
  }

  const err = error as {
    code?: string;
    message?: string;
    response?: { status?: number; data?: unknown };
    request?: unknown;
  };

  // 1. Timeout. Axios reports ECONNABORTED (and ETIMEDOUT on native).
  const axiosCode = typeof err.code === "string" ? err.code : "";
  const rawMessage = typeof err.message === "string" ? err.message : "";
  if (
    axiosCode === "ECONNABORTED" ||
    axiosCode === "ETIMEDOUT" ||
    /timeout/i.test(rawMessage)
  ) {
    return build({
      message: TIMEOUT_MESSAGE,
      code: ERROR_CODES.TIMEOUT_ERROR,
      isTimeoutError: true,
    });
  }

  if (axiosCode === "ERR_CANCELED") {
    return build({
      message: "The request was cancelled.",
      code: ERROR_CODES.REQUEST_CANCELLED,
    });
  }

  // 2. The server answered — prefer its message and code.
  if (err.response && typeof err.response.status === "number") {
    const status = err.response.status;
    const data = err.response.data;

    if (isPlainObject(data)) {
      const serverMessage = isUsableMessage(data.message)
        ? data.message
        : STATUS_MESSAGES[status] ?? UNKNOWN_MESSAGE;
      const serverCode = isNonEmptyString(data.code) ? data.code : codeForStatus(status);
      const errors = Array.isArray(data.errors)
        ? data.errors.filter(isNonEmptyString)
        : undefined;
      const retryAfter =
        typeof data.retryAfter === "number" ? data.retryAfter : undefined;

      return build({
        message: serverMessage,
        code: serverCode,
        status,
        errors: errors && errors.length ? errors : undefined,
        retryAfter,
      });
    }

    // Non-JSON body (an HTML error page from a proxy, or an empty response).
    return build({
      message: STATUS_MESSAGES[status] ?? UNKNOWN_MESSAGE,
      code: status >= 400 ? codeForStatus(status) : ERROR_CODES.INVALID_RESPONSE,
      status,
    });
  }

  // 3. The request left but nothing came back: server down, DNS failure,
  //    connection refused, or no internet.
  if (err.request || axiosCode === "ERR_NETWORK") {
    return build({
      message: NETWORK_MESSAGE,
      code: ERROR_CODES.NETWORK_ERROR,
      isNetworkError: true,
    });
  }

  // 4. Something failed before the request was built, or a non-Axios throw.
  //    A runtime fault is a bug in this app; the user gets the generic message
  //    while the original is left intact for the console and error boundary.
  const isRuntimeFault =
    error instanceof Error && RUNTIME_FAULT_NAMES.has(error.name);

  return build({
    message:
      !isRuntimeFault && isUsableMessage(rawMessage) ? rawMessage : UNKNOWN_MESSAGE,
    code: ERROR_CODES.CLIENT_ERROR,
  });
}

/** Convenience for call sites that only need text to show the user. */
export function getApiErrorMessage(error: unknown, fallback?: string): string {
  const normalized = normalizeApiError(error);
  if (normalized.code === ERROR_CODES.UNKNOWN_ERROR && fallback) {
    return fallback;
  }
  return normalized.message || fallback || UNKNOWN_MESSAGE;
}

/** True when the failure means the user must authenticate again. */
export function isAuthError(error: unknown): boolean {
  return normalizeApiError(error).isAuthError;
}

/** True when the device could not reach the server at all. */
export function isOfflineError(error: unknown): boolean {
  const normalized = normalizeApiError(error);
  return normalized.isNetworkError || normalized.isTimeoutError;
}

/** Wraps any thrown value in an ApiError, preserving an existing one. */
export function toApiError(error: unknown): ApiError {
  return error instanceof ApiError ? error : new ApiError(normalizeApiError(error));
}
