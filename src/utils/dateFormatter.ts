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

const parseDate = (value: string | Date | null | undefined): Date | null => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

export const formatDate = (value: string | Date | null | undefined): string => {
  const d = parseDate(value);
  if (!d) return "—";
  return d.toLocaleDateString(undefined, LONG_DATE_OPTS);
};

export const formatDateTime = (
  value: string | Date | null | undefined
): { date: string; time: string } => {
  const d = parseDate(value);
  if (!d) return { date: "—", time: "" };
  return {
    date: d.toLocaleDateString(undefined, SHORT_DATE_OPTS),
    time: d.toLocaleTimeString(undefined, TIME_OPTS),
  };
};

export const parseToDate = (value: string | Date | null | undefined): Date => {
  return parseDate(value) ?? new Date(0);
};

export const toLocalDateKey = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const todayDateKey = (): string => {
  return toLocalDateKey(new Date());
};

export const shiftDateKey = (key: string, days: number): string => {
  const [y, m, d] = key.split("-").map(Number);
  return toLocalDateKey(new Date(y, (m ?? 1) - 1, (d ?? 1) + days));
};

export const isDateKey = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

export const startOfLocalDay = (key: string): string | undefined => {
  if (!isDateKey(key)) return undefined;
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
};

export const endOfLocalDay = (key: string): string | undefined => {
  if (!isDateKey(key)) return undefined;
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
};
