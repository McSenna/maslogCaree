const APP_UTC_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const EPOCH_WEEKDAY = 4;

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SERVICE_WEEKDAYS: Readonly<Record<string, readonly number[]>> = {
  immunization: [4],
  bp_checking: [1, 2, 3, 4, 5, 6],
  // No Thursdays: the midwife runs immunization that day.
  prenatal: [1, 2, 3, 5, 6],
};

/** Services with their own weekly schedule (mirrors `scheduling: "weekly"` in the backend config). */
const WEEKLY_SERVICES: ReadonlySet<string> = new Set(["immunization", "bp_checking", "prenatal"]);

/**
 * Weekly services where the resident picks the date and time (mirrors
 * `residentPicksTime` in the backend config). Their hours come from the server.
 */
const REGULAR_SCHEDULE_SERVICES: ReadonlySet<string> = new Set(["bp_checking", "prenatal"]);

/**
 * Doctor services residents only request (mirrors `scheduling: "queue"`): no
 * date or time is chosen; the queue assigns one from a medical mission.
 */
const QUEUED_SERVICES: ReadonlySet<string> = new Set(["general_checkup", "consultation"]);

export const isWeeklyService = (serviceKey: string | null | undefined): boolean =>
  Boolean(serviceKey && WEEKLY_SERVICES.has(serviceKey));

export const isRegularScheduleService = (serviceKey: string | null | undefined): boolean =>
  Boolean(serviceKey && REGULAR_SCHEDULE_SERVICES.has(serviceKey));

export const isQueuedService = (serviceKey: string | null | undefined): boolean =>
  Boolean(serviceKey && QUEUED_SERVICES.has(serviceKey));

/** A weekly service whose time the system assigns (immunization). */
export const isAssignedTimeService = (serviceKey: string | null | undefined): boolean =>
  isWeeklyService(serviceKey) && !isRegularScheduleService(serviceKey);

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

/** "Thursday" for a one-day service, "Monday, Tuesday, and Saturday" for several, null for every day. */
export const serviceDayNames = (serviceKey: string | null | undefined): string | null => {
  const names = weekdaysOf(serviceKey)?.map((day) => WEEKDAY_NAMES[day]);
  if (!names) return null;
  return names.length < 3 ? names.join(" and ") : `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
};

/** "Thursday" for a one-day service, "day" otherwise; for copy like "the next open day". */
export const serviceDayWord = (serviceKey: string | null | undefined): string => {
  const weekdays = weekdaysOf(serviceKey);
  return weekdays?.length === 1 ? WEEKDAY_NAMES[weekdays[0]] : "day";
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
  // BP checking and prenatal are never locked to their day (mirrors assertCompletionDayReached).
  if (!weekdaysOf(serviceKey) || isRegularScheduleService(serviceKey)) return false;
  const scheduledDay = slotStart ? appDayNumber(slotStart) : null;
  const today = appDayNumber(now);
  return scheduledDay == null || today == null || today < scheduledDay;
};
