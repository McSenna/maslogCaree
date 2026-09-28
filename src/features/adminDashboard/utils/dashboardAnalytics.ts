import type { TrendPoint } from "@/services/adminDashboardService";

export const calculatePercentage = (count: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
};

export type TrendDirection = "up" | "down" | "flat";

export type Trend = {
  direction: TrendDirection;
  percent: number;
};

export const calculateTrend = (current: number, previous: number): Trend => {
  if (previous <= 0) {
    if (current <= 0) return { direction: "flat", percent: 0 };
    return { direction: "up", percent: 100 };
  }
  const delta = current - previous;
  if (delta === 0) return { direction: "flat", percent: 0 };
  return {
    direction: delta > 0 ? "up" : "down",
    percent: Math.round((Math.abs(delta) / previous) * 100),
  };
};

export const getBusiestPoint = (trend: TrendPoint[]): TrendPoint | null => {
  return trend.reduce<TrendPoint | null>((best, point) => {
    if (point.count <= 0) return best;
    if (best === null || point.count > best.count) return point;
    return best;
  }, null);
};

export const formatActivityCount = (count: number): string => {
  return count.toLocaleString();
};

const WEEKDAY_NAMES: Record<string, string> = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

export const expandWeekday = (label: string): string => {
  return WEEKDAY_NAMES[label] ?? label;
};

const MONTH_NAMES: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

export const expandMonth = (label: string): string => {
  return MONTH_NAMES[label] ?? label;
};

export type WindowComparison = {
  currentWindow: TrendPoint[];
  currentTotal: number;
  previousTotal: number;
  trend: Trend;
};

export const compareTrailingWindows = (trend: TrendPoint[], windowSize: number): WindowComparison => {
  const currentWindow = trend.slice(-windowSize);
  const previousWindow = trend.slice(-windowSize * 2, -windowSize);
  const currentTotal = currentWindow.reduce((sum, p) => sum + p.count, 0);
  const previousTotal = previousWindow.reduce((sum, p) => sum + p.count, 0);
  return {
    currentWindow,
    currentTotal,
    previousTotal,
    trend: calculateTrend(currentTotal, previousTotal),
  };
};

/** The backend keys monthly buckets as `YYYY-M` (e.g. "2026-9"); month is 1-based. */
export const parseMonthKey = (key: string): { year: number; month: number } | null => {
  const match = /^(\d{4})-(\d{1,2})$/.exec(key);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  return month >= 1 && month <= 12 ? { year, month } : null;
};

/** "September 2026", falling back to the expanded label when the key can't be read. */
export const formatMonthYear = (point: TrendPoint): string => {
  const parsed = parseMonthKey(point.key);
  return parsed ? `${expandMonth(point.label)} ${parsed.year}` : expandMonth(point.label);
};

/** True for the bucket of the month that is still in progress, whose count is month-to-date. */
export const isCurrentMonth = (point: TrendPoint, now: Date = new Date()): boolean => {
  const parsed = parseMonthKey(point.key);
  return parsed !== null && parsed.year === now.getFullYear() && parsed.month === now.getMonth() + 1;
};

/** "Apr – Sep 2026", or "Nov 2025 – Apr 2026" when the window crosses a year. */
export const monthRangeLabel = (points: TrendPoint[]): string => {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  const a = parseMonthKey(first.key);
  const b = parseMonthKey(last.key);
  if (!a || !b) return `${first.label} – ${last.label}`;
  if (points.length === 1) return `${last.label} ${b.year}`;
  return a.year === b.year
    ? `${first.label} – ${last.label} ${b.year}`
    : `${first.label} ${a.year} – ${last.label} ${b.year}`;
};
