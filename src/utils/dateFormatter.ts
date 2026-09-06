/**
 * Reusable date formatting utilities.
 * Handles null / undefined / invalid dates without crashing.
 */

const LONG_DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

const SHORT_DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const TIME_OPTS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};

function parseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Returns a long-form date string.
 * @example formatDate("2026-08-15T00:00:00Z") → "August 15, 2026"
 */
export function formatDate(value: string | Date | null | undefined): string {
  const d = parseDate(value);
  if (!d) return "—";
  return d.toLocaleDateString(undefined, LONG_DATE_OPTS);
}

/**
 * Returns a two-line date + time string object.
 * @example formatDateTime("2026-08-15T04:30:00Z") → { date: "Aug 15, 2026", time: "04:30 AM" }
 */
export function formatDateTime(
  value: string | Date | null | undefined
): { date: string; time: string } {
  const d = parseDate(value);
  if (!d) return { date: "—", time: "" };
  return {
    date: d.toLocaleDateString(undefined, SHORT_DATE_OPTS),
    time: d.toLocaleTimeString(undefined, TIME_OPTS),
  };
}

/**
 * Returns a raw Date for comparison/sorting purposes.
 */
export function parseToDate(value: string | Date | null | undefined): Date {
  return parseDate(value) ?? new Date(0);
}
