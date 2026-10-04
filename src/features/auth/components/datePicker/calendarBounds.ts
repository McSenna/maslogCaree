// Import-free so `node --test` can load it.
// The days a calendar may offer, as YYYY-MM-DD strings (which compare
// correctly as text and stay stable between renders). null means no limit.
export type DateBounds = { min: string | null; max: string | null };

const pad = (value: number) => String(value).padStart(2, "0");

export const isoOf = (year: number, monthIndex: number, day: number): string =>
  `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

export const todayIso = (now: Date = new Date()): string => isoOf(now.getFullYear(), now.getMonth(), now.getDate());

/** Birth dates and other past days: anything up to today. */
export const pastOnly = (now: Date = new Date()): DateBounds => ({ min: null, max: todayIso(now) });

export const isOutside = (iso: string, bounds: DateBounds): boolean =>
  (bounds.min !== null && iso < bounds.min) || (bounds.max !== null && iso > bounds.max);

const lastDayOf = (year: number, monthIndex: number) => new Date(year, monthIndex + 1, 0).getDate();

/** True when at least one day of the month can be picked. */
export const monthInRange = (year: number, monthIndex: number, bounds: DateBounds): boolean =>
  !isOutside(isoOf(year, monthIndex, 1), { min: null, max: bounds.max }) &&
  !isOutside(isoOf(year, monthIndex, lastDayOf(year, monthIndex)), { min: bounds.min, max: null });

/** Keeps the shown month inside the range when the year changes. */
export const clampMonth = (year: number, monthIndex: number, bounds: DateBounds): number => {
  let month = monthIndex;
  if (bounds.max && Number(bounds.max.slice(0, 4)) === year) month = Math.min(month, Number(bounds.max.slice(5, 7)) - 1);
  if (bounds.min && Number(bounds.min.slice(0, 4)) === year) month = Math.max(month, Number(bounds.min.slice(5, 7)) - 1);
  return month;
};

// Birth dates reach back a century; dates with no upper limit (a next
// check-up, a vaccine expiry) reach a few years ahead.
const YEARS_BACK = 99;
const YEARS_AHEAD = 5;

/** Years to offer, newest first. */
export const yearOptions = (bounds: DateBounds, now: Date = new Date()): number[] => {
  const current = now.getFullYear();
  const newest = bounds.max ? Number(bounds.max.slice(0, 4)) : current + YEARS_AHEAD;
  const oldest = bounds.min ? Number(bounds.min.slice(0, 4)) : current - YEARS_BACK;
  return Array.from({ length: Math.max(0, newest - oldest + 1) }, (_, index) => newest - index);
};
