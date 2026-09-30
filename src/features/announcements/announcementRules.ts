/**
 * Pure rules for the announcement form. Import-free (type imports are erased)
 * so `node --test` can load it; the API re-checks every rule.
 */
import type {
  AnnouncementFormErrors,
  AnnouncementFormValues,
  CreateAnnouncementPayload,
} from "./announcement.types.ts";
import {
  MAX_DAYS_AHEAD,
  addDays,
  combineDateTime,
  endOfDateKey,
  parseClock,
  parseDateKey,
  startOfDay,
} from "./announcementDates.ts";

export {
  announcementDateRange,
  combineDateTime,
  parseClock,
  parseDateKey,
  toClock,
  toDateKey,
} from "./announcementDates.ts";

// Mirrors ANNOUNCEMENT_LIMITS in backend/config/announcements.js.
export const ANNOUNCEMENT_LIMITS = {
  titleMin: 5,
  titleMax: 120,
  messageMin: 10,
  messageMax: 800,
  locationMin: 3,
  locationMax: 160,
  maxDaysAhead: MAX_DAYS_AHEAD,
} as const;

/** The stored values an edit starts from; unchanged dates skip the "not in the past" rules. */
export type AnnouncementBaseline = Pick<AnnouncementFormValues, "date" | "time" | "endDate">;

const lengthError = (label: string, value: string, min: number, max: number): string | undefined => {
  if (!value) return `${label} is required.`;
  if (value.length < min) return `${label} must be at least ${min} characters.`;
  if (value.length > max) return `${label} must not exceed ${max} characters.`;
  return undefined;
};

const dateError = (key: string, now: Date, unchanged: boolean): string | undefined => {
  if (!key) return "Choose the date.";
  const day = parseDateKey(key);
  if (!day) return "Enter a valid date.";
  if (unchanged) return undefined;
  if (day < startOfDay(now)) return "The date cannot be in the past.";
  if (day > addDays(now, MAX_DAYS_AHEAD)) {
    return `The date must be within the next ${MAX_DAYS_AHEAD} days.`;
  }
  return undefined;
};

const timeError = (clock: string): string | undefined => {
  if (!clock) return "Choose the time.";
  return parseClock(clock) === null ? "Enter a valid time." : undefined;
};

const endDateError = (values: AnnouncementFormValues, now: Date, unchanged: boolean): string | undefined => {
  if (!values.endDate) return undefined;
  const end = parseDateKey(values.endDate);
  if (!end) return "Enter a valid end date.";
  if (unchanged) return undefined;
  if (end < startOfDay(now)) return "The end date cannot be in the past.";
  const event = parseDateKey(values.date);
  if (event && end < event) return "The end date cannot be before the event.";
  return undefined;
};

/** Same rules as the API so problems show beside the field before a round trip. */
export const validateAnnouncementForm = (
  values: AnnouncementFormValues,
  now: Date = new Date(),
  baseline: AnnouncementBaseline | null = null
): AnnouncementFormErrors => {
  const L = ANNOUNCEMENT_LIMITS;
  const eventUnchanged = Boolean(baseline && baseline.date === values.date && baseline.time === values.time);
  const endUnchanged = Boolean(baseline && baseline.endDate === values.endDate);

  const candidates: AnnouncementFormErrors = {
    title: lengthError("Title", values.title.trim(), L.titleMin, L.titleMax),
    message: lengthError("Message", values.message.trim(), L.messageMin, L.messageMax),
    date: dateError(values.date, now, eventUnchanged),
    time: timeError(values.time),
    location: lengthError("Location", values.location.trim(), L.locationMin, L.locationMax),
    endDate: endDateError(values, now, endUnchanged),
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
    audience: values.audience,
    expiresAt: endOfDateKey(values.endDate)?.toISOString() ?? null,
    isDraft: values.isDraft,
  };
};

// The API names the combined timestamp `eventAt` and the end date `expiresAt`.
const SERVER_FIELDS: Record<string, keyof AnnouncementFormErrors> = {
  title: "title",
  message: "message",
  eventAt: "date",
  location: "location",
  audience: "audience",
  expiresAt: "endDate",
  isDraft: "isDraft",
};

export const mapServerFieldErrors = (
  fieldErrors: Record<string, string> = {}
): AnnouncementFormErrors => {
  const mapped: AnnouncementFormErrors = {};
  for (const [serverField, message] of Object.entries(fieldErrors)) {
    const field = SERVER_FIELDS[serverField];
    if (field && message) mapped[field] = message;
  }
  return mapped;
};
