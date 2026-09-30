/**
 * Local-calendar date helpers for the announcement form. Import-free so
 * `node --test` can load it.
 */

// Mirrors ANNOUNCEMENT_LIMITS.maxDaysAhead in backend/config/announcements.js.
export const MAX_DAYS_AHEAD = 365;

const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;
const CLOCK = /^(\d{2}):(\d{2})$/;

const pad2 = (value: number): string => String(value).padStart(2, "0");

export const toDateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export const toClock = (date: Date): string => `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;

/** A local Date for "YYYY-MM-DD", or null when the key is not a real calendar day. */
export const parseDateKey = (key: string): Date | null => {
  const match = DATE_KEY.exec(key);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null;
};

/** Minutes past midnight for "HH:MM", or null when it is not a real clock time. */
export const parseClock = (clock: string): number | null => {
  const match = CLOCK.exec(clock);
  if (!match) return null;
  const [hours, minutes] = [Number(match[1]), Number(match[2])];
  return hours <= 23 && minutes <= 59 ? hours * 60 + minutes : null;
};

/** Joins the form's local date and time into the instant the API stores. */
export const combineDateTime = (dateKey: string, clock: string): Date | null => {
  const day = parseDateKey(dateKey);
  const minutes = parseClock(clock);
  if (!day || minutes === null) return null;
  day.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return day;
};

/** The last minute of a local day: an end date keeps the announcement up all that day. */
export const endOfDateKey = (dateKey: string): Date | null => {
  const day = parseDateKey(dateKey);
  if (!day) return null;
  day.setHours(23, 59, 0, 0);
  return day;
};

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const startOfDay = (date: Date): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

/** First and last day the date picker should offer, as date keys. */
export const announcementDateRange = (now: Date = new Date()) => ({
  min: toDateKey(now),
  max: toDateKey(addDays(now, MAX_DAYS_AHEAD)),
});
