export const isAdministered = (record: { state: string } | null): boolean =>
  record?.state === "administered";

export const todayKey = (now: Date = new Date()): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
};

export const isCalendarDay = (day: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = new Date(`${day}T00:00:00.000Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day
  );
};

export const validateBirth = (day: string, now = new Date()): string => {
  if (!isCalendarDay(day)) return "Select a valid date of birth.";
  if (day > todayKey(now)) return "The date of birth cannot be in the future.";
  return "";
};

export const validateAdministration = (
  day: string,
  birth: string,
  now = new Date(),
): string => {
  if (!isCalendarDay(day))
    return "Select the actual date this dose was administered.";
  if (day < birth.slice(0, 10))
    return "The administration date cannot be before the baby's birth date.";
  if (day > todayKey(now))
    return "The administration date cannot be in the future.";
  return "";
};

let birthSequence = 0;
export const newBirthRequestKey = (): string =>
  `birth-${Date.now()}-${++birthSequence}-${Math.random().toString(36).slice(2)}`;

export const requestProblem = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  return "The record could not be loaded or saved. Check your connection and try again.";
};
