import { ERROR_CODES } from "@/utils/errorCodes";

import { ApiError, type NormalizedApiError } from "./ApiError";
import {
  NETWORK_MESSAGE,
  RUNTIME_FAULT_NAMES,
  STATUS_MESSAGES,
  TIMEOUT_MESSAGE,
  UNKNOWN_MESSAGE,
  build,
  codeForStatus,
  isNonEmptyString,
  isNormalized,
  isPlainObject,
  isUsableMessage,
} from "./errorClassification";

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (error == null) {
    return build({ message: UNKNOWN_MESSAGE, code: ERROR_CODES.UNKNOWN_ERROR });
  }

  if (isNormalized(error) && !(error instanceof Error)) {
    return error;
  }

  if (error instanceof ApiError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      errors: error.errors,
      fieldErrors: error.fieldErrors,
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
      const fieldErrors = isPlainObject(data.fieldErrors)
        ? Object.fromEntries(
            Object.entries(data.fieldErrors).filter(([, message]) =>
              isNonEmptyString(message)
            ) as [string, string][]
          )
        : undefined;

      return build({
        message: serverMessage,
        code: serverCode,
        status,
        errors: errors && errors.length ? errors : undefined,
        fieldErrors:
          fieldErrors && Object.keys(fieldErrors).length ? fieldErrors : undefined,
        retryAfter,
      });
    }

    return build({
      message: STATUS_MESSAGES[status] ?? UNKNOWN_MESSAGE,
      code: status >= 400 ? codeForStatus(status) : ERROR_CODES.INVALID_RESPONSE,
      status,
    });
  }

  if (err.request || axiosCode === "ERR_NETWORK") {
    return build({
      message: NETWORK_MESSAGE,
      code: ERROR_CODES.NETWORK_ERROR,
      isNetworkError: true,
    });
  }

  const isRuntimeFault =
    error instanceof Error && RUNTIME_FAULT_NAMES.has(error.name);

  return build({
    message:
      !isRuntimeFault && isUsableMessage(rawMessage) ? rawMessage : UNKNOWN_MESSAGE,
    code: ERROR_CODES.CLIENT_ERROR,
  });
};

export const getApiErrorMessage = (error: unknown, fallback?: string): string => {
  const normalized = normalizeApiError(error);
  if (normalized.code === ERROR_CODES.UNKNOWN_ERROR && fallback) {
    return fallback;
  }
  return normalized.message || fallback || UNKNOWN_MESSAGE;
};

export const isAuthError = (error: unknown): boolean => {
  return normalizeApiError(error).isAuthError;
};

export const isOfflineError = (error: unknown): boolean => {
  const normalized = normalizeApiError(error);
  return normalized.isNetworkError || normalized.isTimeoutError;
};

export const toApiError = (error: unknown): ApiError => {
  return error instanceof ApiError ? error : new ApiError(normalizeApiError(error));
};
