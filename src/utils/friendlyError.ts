export const DEFAULT_ERROR_MESSAGE = "Please check your internet connection and try again.";

const TECHNICAL_PATTERN =
  /(\bat\s+\S+\s*\(|\bstack\b|TypeError|ReferenceError|SyntaxError|ECONN\w*|ENOTFOUND|ETIMEDOUT|status code \d{3}|\bundefined\b|<html|<!doctype|Network Error)/i;

const SERVER_FAILURE_PATTERN =
  /^(internal( server)? error|service unavailable|bad gateway|gateway time-?out|server error|something went wrong)\.?$/i;

const MAX_LENGTH = 220;

export const friendlyErrorMessage = (
  message: string | null | undefined,
  fallback: string = DEFAULT_ERROR_MESSAGE
): string => {
  const text = (message ?? "").trim();
  if (!text || text.length > MAX_LENGTH || TECHNICAL_PATTERN.test(text) || SERVER_FAILURE_PATTERN.test(text)) {
    return fallback;
  }
  return text;
};
