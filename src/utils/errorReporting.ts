import { normalizeApiError } from "@/utils/apiErrorHandler";

const isDev = typeof __DEV__ !== "undefined" && __DEV__;

/**
 * The one place failures are logged. Only the error's kind, code and status are
 * written, never its message or payload: server messages can name a resident
 * or a condition (RA 10173). Production builds log nothing.
 */
export const reportError = (context: string, error: unknown): void => {
  if (!isDev) return;
  const { code, status } = normalizeApiError(error);
  const kind = error instanceof Error ? error.name : typeof error;
  console.warn(`[error] ${context}`, { kind, code, status });
};
