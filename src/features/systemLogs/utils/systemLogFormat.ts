import type { SystemLog, SystemLogStatMetric } from "../types/systemLog.types";


export const formatSystemLogAction = (action: string): string => {
  return (action || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
};

export const formatSystemLogActionLabel = (log: Pick<SystemLog, "action" | "success">): string => {
  const label = formatSystemLogAction(log.action);
  if (/^Login$/i.test(log.action) && log.success) return "Login successful";
  if (/failed/i.test(log.action)) return `Failed ${label.replace(/ failed/i, "").toLowerCase()} attempt`;
  if (/^logout$/i.test(log.action)) return "Logout successful";
  return label;
};

export const normalizeRoleLabel = (role?: string): string => {
  const value = (role || "unknown").toLowerCase();
  const map: Record<string, string> = {
    admin: "Administrator",
    doctor: "Doctor",
    midwife: "Midwife",
    bhw: "BHW",
    resident: "Resident",
    unknown: "—",
  };
  return map[value] || value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatSystemLogDate = (value?: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const formatSystemLogDateTime = (value?: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
};

export const formatRelativeTime = (value?: string): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec} seconds ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return "";
};

export const formatStatValue = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const formatStatChange = (metric: SystemLogStatMetric): string => {
  const sign = metric.direction === "up" ? "↑" : "↓";
  return `${sign} ${Math.abs(metric.change)}%`;
};
