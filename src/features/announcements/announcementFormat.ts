import { parseClock, parseDateKey } from "./announcementRules";

const toDate = (iso: string): Date | null => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** "Sat, Oct 12, 2026" */
export const formatAnnouncementDate = (iso: string): string =>
  toDate(iso)?.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }) ?? "";

/** "Saturday, October 12, 2026" */
export const formatAnnouncementLongDate = (iso: string): string =>
  toDate(iso)?.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }) ?? "";

/** "9:00 AM" */
export const formatAnnouncementTime = (iso: string): string =>
  toDate(iso)?.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) ?? "";

/** "Posted Oct 1, 2026" */
export const formatPostedDate = (iso: string | null): string => {
  const date = iso ? toDate(iso) : null;
  return date
    ? `Posted ${date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
    : "";
};

export const isAnnouncementPast = (iso: string, now: Date = new Date()): boolean => {
  const date = toDate(iso);
  return Boolean(date && date.getTime() < now.getTime());
};

/** Picker label for a "YYYY-MM-DD" key, e.g. "Saturday, October 12, 2026". */
export const formatDateKeyLabel = (key: string): string =>
  parseDateKey(key)?.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }) ?? "";

/** Picker label for an "HH:MM" value, e.g. "9:00 AM". */
export const formatClockLabel = (clock: string): string => {
  const minutes = parseClock(clock);
  if (minutes === null) return "";
  return new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};
