import { normalizeApiError } from "@/utils/apiErrorHandler";

const isDev = typeof __DEV__ !== "undefined" && __DEV__;

export const reportError = (context: string, error: unknown): void => {
  if (!isDev) return;
  const { code, status } = normalizeApiError(error);
  const kind = error instanceof Error ? error.name : typeof error;
  console.warn(`[error] ${context}`, { kind, code, status });
};
