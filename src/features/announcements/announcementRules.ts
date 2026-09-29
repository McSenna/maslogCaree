/**
 * Pure rules for the create-announcement form. Import-free (type imports are
 * erased) so `node --test` can load it; the API re-checks every rule.
 */
import type {
  AnnouncementFormErrors,
  AnnouncementFormValues,
  CreateAnnouncementPayload,
} from "./announcement.types.ts";

// Mirrors ANNOUNCEMENT_LIMITS in backend/config/announcements.js.
export const ANNOUNCEMENT_LIMITS = {
  titleMin: 5,
  titleMax: 120,
  messageMin: 10,
  messageMax: 800,
  locationMin: 3,
  locationMax: 160,
  maxDaysAhead: 365,
} as const;

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

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const startOfDay = (date: Date): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

/** First and last day the date picker should offer, as date keys. */
export const announcementDateRange = (now: Date = new Date()) => ({
  min: toDateKey(now),
  max: toDateKey(addDays(now, ANNOUNCEMENT_LIMITS.maxDaysAhead)),
});

const lengthError = (label: string, value: string, min: number, max: number): string | undefined => {
  if (!value) return `${label} is required.`;
  if (value.length < min) return `${label} must be at least ${min} characters.`;
  if (value.length > max) return `${label} must not exceed ${max} characters.`;
  return undefined;
};

const dateError = (key: string, now: Date): string | undefined => {
  if (!key) return "Choose the date.";
  const day = parseDateKey(key);
  if (!day) return "Enter a valid date.";
  if (day < startOfDay(now)) return "The date cannot be in the past.";
  if (day > addDays(now, ANNOUNCEMENT_LIMITS.maxDaysAhead)) {
    return `The date must be within the next ${ANNOUNCEMENT_LIMITS.maxDaysAhead} days.`;
  }
  return undefined;
};

const timeError = (clock: string): string | undefined => {
  if (!clock) return "Choose the time.";
  return parseClock(clock) === null ? "Enter a valid time." : undefined;
};

/** Same rules as the API so problems show beside the field before a round trip. */
export const validateAnnouncementForm = (
  values: AnnouncementFormValues,
  now: Date = new Date()
): AnnouncementFormErrors => {
  const L = ANNOUNCEMENT_LIMITS;
  const candidates: AnnouncementFormErrors = {
    title: lengthError("Title", values.title.trim(), L.titleMin, L.titleMax),
    message: lengthError("Message", values.message.trim(), L.messageMin, L.messageMax),
    date: dateError(values.date, now),
    time: timeError(values.time),
    location: lengthError("Location", values.location.trim(), L.locationMin, L.locationMax),
  };

  const errors: AnnouncementFormErrors = {};
  for (const [field, message] of Object.entries(candidates) as [keyof AnnouncementFormErrors, string?][]) {
    if (message) errors[field] = message;
  }
  return errors;
};

export const hasAnnouncementErrors = (errors: AnnouncementFormErrors): boolean =>
  Object.values(errors).some(Boolean);

/** Call only after validation passes. */
export const toCreatePayload = (values: AnnouncementFormValues): CreateAnnouncementPayload => {
  const eventAt = combineDateTime(values.date, values.time);
  if (!eventAt) throw new Error("toCreatePayload needs a valid date and time");

  return {
    title: values.title.trim(),
    message: values.message.trim(),
    eventAt: eventAt.toISOString(),
    location: values.location.trim(),
  };
};

/** The API reports the combined timestamp as `eventAt`; show it on the date picker. */
export const mapServerFieldErrors = (
  fieldErrors: Record<string, string> = {}
): AnnouncementFormErrors => {
  const mapped: AnnouncementFormErrors = {};
  if (fieldErrors.title) mapped.title = fieldErrors.title;
  if (fieldErrors.message) mapped.message = fieldErrors.message;
  if (fieldErrors.eventAt) mapped.date = fieldErrors.eventAt;
  if (fieldErrors.location) mapped.location = fieldErrors.location;
  return mapped;
};
