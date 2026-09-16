const pad2 = (value: number): string => String(value).padStart(2, "0");

export const toIsoDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

export const toClockTime = (date: Date): string => {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};

export const fromIsoDateKey = (key: string): Date => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
};

export const fromClockTime = (time: string): Date => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(Number.isFinite(hours) ? hours : 0, Number.isFinite(minutes) ? minutes : 0, 0, 0);
  return date;
};

export const formatClockLabel = (time: string): string => {
  const [hours, minutes] = String(time).split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return time;
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${pad2(hour12)}:${pad2(minutes)} ${suffix}`;
};

export const formatLongDateLabel = (key: string): string => {
  const date = fromIsoDateKey(key);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const toMinutesOfDay = (time: string): number => {
  const [hours, minutes] = String(time).split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return NaN;
  return hours * 60 + minutes;
};

export const isEndAfterStart = (start: string, end: string): boolean => {
  const startMinutes = toMinutesOfDay(start);
  const endMinutes = toMinutesOfDay(end);
  if (!Number.isFinite(startMinutes) || !Number.isFinite(endMinutes)) return true;
  return endMinutes > startMinutes;
};

export const isoTimestampToDateKey = (timestamp: string | undefined): string => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? "" : toIsoDateKey(date);
};
