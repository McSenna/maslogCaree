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
