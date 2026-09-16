import { ERROR_CODES, SESSION_ENDING_CODES } from "@/utils/errorCodes";

import type { NormalizedApiError } from "./ApiError";

export const STATUS_MESSAGES: Record<number, string> = {
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

export const NETWORK_MESSAGE =
  "Unable to connect to the server. Please check your connection and try again.";
export const TIMEOUT_MESSAGE = "The request took too long. Please try again.";
export const UNKNOWN_MESSAGE = "An unexpected error occurred. Please try again.";

export const codeForStatus = (status: number): string => {
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

export const VALIDATION_CODES: string[] = [
  ERROR_CODES.VALIDATION_ERROR,
  ERROR_CODES.MISSING_FIELDS,
  ERROR_CODES.INVALID_FORMAT,
  ERROR_CODES.INVALID_PHOTO,
];

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isNormalized = (value: unknown): value is NormalizedApiError =>
  isPlainObject(value) &&
  typeof value.message === "string" &&
  typeof value.code === "string" &&
  typeof value.isNetworkError === "boolean" &&
  typeof value.isTimeoutError === "boolean";

export const RUNTIME_FAULT_NAMES = new Set([
  "TypeError",
  "ReferenceError",
  "RangeError",
  "SyntaxError",
  "EvalError",
  "URIError",
]);

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const RAW_LIBRARY_MESSAGE =
  /^(Network Error|Request failed with status code \d+|timeout of \d+ms exceeded|<!DOCTYPE|<html)/i;

export const isUsableMessage = (value: unknown): value is string =>
  isNonEmptyString(value) && !RAW_LIBRARY_MESSAGE.test(value.trim());

export const build = (partial: Partial<NormalizedApiError> & { message: string; code: string }): NormalizedApiError => {
  const status = partial.status;
  return {
    message: partial.message,
    code: partial.code,
    status,
    errors: partial.errors,
    fieldErrors: partial.fieldErrors,
    retryAfter: partial.retryAfter,
    isNetworkError: partial.isNetworkError ?? false,
    isTimeoutError: partial.isTimeoutError ?? false,
    isAuthError: partial.isAuthError ?? (status === 401 || SESSION_ENDING_CODES.includes(partial.code)),
    isValidationError:
      partial.isValidationError ?? (status === 422 || VALIDATION_CODES.includes(partial.code)),
  };
};
