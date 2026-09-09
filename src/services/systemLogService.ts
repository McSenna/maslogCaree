import { Platform } from "react-native";
import api from "@/services/api";

export type SystemLogRole = "admin" | "doctor" | "midwife" | "bhw" | "resident" | "unknown";
export type SystemLogPlatform = "Web" | "Android" | "iOS";
export type SystemLogSeverity = "info" | "success" | "warning" | "error";
export type SystemLogStatus = "Success" | "Failed";

export interface SystemLog {
  _id: string;
  action: string;
  role: SystemLogRole;
  ipAddress: string;
  platform: SystemLogPlatform | string;
  /**
   * The authorization platform the request was attributed to ("web"/"mobile"),
   * as opposed to `platform` above, which is the device read from the user
   * agent. Empty on entries written before platform binding existed.
   */
  clientPlatform?: string;
  createdAt: string;
  description?: string;
  resource?: string;
  resourceId?: string;
  success: boolean;
  status: SystemLogStatus;
  severity: SystemLogSeverity;
  module: string;
  logType: string;
  device: string;
  browser: string;
  userName: string;
  userEmail: string;
  metadata?: Record<string, any>;
}

export interface SystemLogsQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  action?: string;
  platform?: string;
  severity?: string;
  logType?: string;
  fromDate?: string;
  toDate?: string;
  sort?: "asc" | "desc";
}

export interface SystemLogListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  logs: SystemLog[];
}

export interface SystemLogStatMetric {
  value: number;
  change: number;
  direction: "up" | "down";
  comparisonLabel: string;
}

export interface SystemLogStatsResponse {
  success: boolean;
  stats: {
    totalLogs: SystemLogStatMetric;
    errorsToday: SystemLogStatMetric;
    warnings: SystemLogStatMetric;
    successfulActions: SystemLogStatMetric;
  };
}

export const systemLogActions = [
  "ALL",
  "LOGIN",
  "LOGOUT",
  "LOGIN_FAILED",
  "RESIDENT_WEB_LOGIN_BLOCKED",
  "PLATFORM_ACCESS_DENIED",
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DELETED",
  "USER_ROLE_CHANGED",
  "USER_VERIFIED",
  "USER_UNVERIFIED",
  "APPOINTMENT_CREATED",
  "APPOINTMENT_UPDATED",
  "APPOINTMENT_APPROVED",
  "APPOINTMENT_REJECTED",
  "APPOINTMENT_CANCELLED",
  "APPOINTMENT_RESCHEDULED",
  "RECORD_CREATED",
  "RECORD_UPDATED",
  "RECORD_VIEWED",
  "SCHEDULE_CREATED",
  "SCHEDULE_UPDATED",
  "SCHEDULE_DELETED",
] as const;

export const SEVERITY_OPTIONS = ["all", "info", "success", "warning", "error"] as const;

// Mirrors backend/services/systemLogService.js MODULE_RULES + its
// "System Event" catch-all — kept in sync by hand since it's a small,
// rarely-changing list rather than a fetched enum.
export const LOG_TYPE_OPTIONS = [
  "all",
  "User Authentication",
  "User Management",
  "Appointment Activity",
  "Patient Records",
  "Schedule Management",
  "System Event",
] as const;

export const ROLE_FILTER_OPTIONS = ["all", "admin", "doctor", "midwife", "bhw", "resident"] as const;

export async function fetchSystemLogs(params: SystemLogsQuery = {}): Promise<SystemLogListResponse> {
  const response = await api.get<SystemLogListResponse>("/system-logs", { params });
  return response.data;
}

export async function fetchSystemLogStats(): Promise<SystemLogStatsResponse> {
  const response = await api.get<SystemLogStatsResponse>("/system-logs/stats");
  return response.data;
}

export async function exportSystemLogs(params: SystemLogsQuery = {}): Promise<void> {
  const response = await api.get("/system-logs/export", {
    params,
    responseType: "blob",
  });

  if (Platform.OS !== "web") {
    throw new Error("Export is only available on web.");
  }

  const blob = response.data as Blob;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `system-logs-${stamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatSystemLogAction(action: string): string {
  return (action || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

/** "Login" -> "Login successful" / "Login Failed" -> "Failed login attempt" style copy for the Action column. */
export function formatSystemLogActionLabel(log: Pick<SystemLog, "action" | "success">): string {
  const label = formatSystemLogAction(log.action);
  if (/^Login$/i.test(log.action) && log.success) return "Login successful";
  if (/failed/i.test(log.action)) return `Failed ${label.replace(/ failed/i, "").toLowerCase()} attempt`;
  if (/^logout$/i.test(log.action)) return "Logout successful";
  return label;
}

export function normalizeRoleLabel(role?: string): string {
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
}

export function formatSystemLogDate(value?: string): string {
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
}

export function formatSystemLogDateTime(value?: string): string {
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
}

export function formatRelativeTime(value?: string): string {
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
}

export function formatStatValue(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatStatChange(metric: SystemLogStatMetric): string {
  const sign = metric.direction === "up" ? "↑" : "↓";
  return `${sign} ${Math.abs(metric.change)}%`;
}
