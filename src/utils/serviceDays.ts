const APP_UTC_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const EPOCH_WEEKDAY = 4;

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SERVICE_WEEKDAYS: Readonly<Record<string, readonly number[]>> = {
  immunization: [4],
};

/** Services with their own weekly schedule (mirrors `scheduling: "weekly"` in the backend config). */
const WEEKLY_SERVICES: ReadonlySet<string> = new Set(["immunization"]);

export const isWeeklyService = (serviceKey: string | null | undefined): boolean =>
  Boolean(serviceKey && WEEKLY_SERVICES.has(serviceKey));

const weekdaysOf = (serviceKey: string | null | undefined): readonly number[] | null =>
  (serviceKey && SERVICE_WEEKDAYS[serviceKey]) || null;

const appDayNumber = (value: string | Date): number | null => {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : Math.floor((time + APP_UTC_OFFSET_MS) / DAY_MS);
};

export const appWeekday = (value: string | Date): number | null => {
  const day = appDayNumber(value);
  return day == null ? null : (((day + EPOCH_WEEKDAY) % 7) + 7) % 7;
};

export const isServiceDay = (serviceKey: string | null | undefined, value: string | Date): boolean => {
  const weekdays = weekdaysOf(serviceKey);
  if (!weekdays) return true;
  const weekday = appWeekday(value);
  return weekday != null && weekdays.includes(weekday);
};

/** "Thursday" for a fixed-day service, null for a service open every day. */
export const serviceDayNames = (serviceKey: string | null | undefined): string | null => {
  const weekdays = weekdaysOf(serviceKey);
  return weekdays ? weekdays.map((day) => WEEKDAY_NAMES[day]).join(" and ") : null;
};

export const serviceDayNote = (serviceKey: string | null | undefined, serviceLabel: string): string | null => {
  const days = serviceDayNames(serviceKey);
  return days ? `${serviceLabel} appointments are available every ${days} only.` : null;
};

export const msUntilNextAppDay = (now: Date = new Date()): number => {
  const intoDay = (((now.getTime() + APP_UTC_OFFSET_MS) % DAY_MS) + DAY_MS) % DAY_MS;
  return DAY_MS - intoDay;
};

export const isCompletionLocked = (
  serviceKey: string | null | undefined,
  slotStart: string | null | undefined,
  now: Date = new Date()
): boolean => {
  if (!weekdaysOf(serviceKey)) return false;
  const scheduledDay = slotStart ? appDayNumber(slotStart) : null;
  const today = appDayNumber(now);
  return scheduledDay == null || today == null || today < scheduledDay;
};
