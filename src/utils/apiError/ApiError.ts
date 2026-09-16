export interface NormalizedApiError {
  message: string;
  code: string;
  status?: number;
  errors?: string[];
  fieldErrors?: Record<string, string>;
  retryAfter?: number;
  isNetworkError: boolean;
  isTimeoutError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;
}

export class ApiError extends Error implements NormalizedApiError {
  code: string;
  status?: number;
  errors?: string[];
  fieldErrors?: Record<string, string>;
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
    this.fieldErrors = normalized.fieldErrors;
    this.retryAfter = normalized.retryAfter;
    this.isNetworkError = normalized.isNetworkError;
    this.isTimeoutError = normalized.isTimeoutError;
    this.isAuthError = normalized.isAuthError;
    this.isValidationError = normalized.isValidationError;
  }
}
