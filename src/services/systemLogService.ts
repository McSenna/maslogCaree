import api from "@/services/api";

export type SystemLogRole = "admin" | "doctor" | "midwife" | "bhw" | "resident" | "unknown";
export type SystemLogPlatform = "Web" | "Android" | "iOS";

export interface SystemLog {
  _id: string;
  action: string;
  role: SystemLogRole;
  ipAddress: string;
  platform: SystemLogPlatform | string;
  createdAt: string;
  description?: string;
  resource?: string;
  resourceId?: string;
  success?: boolean;
  metadata?: Record<string, any>;
}

export interface SystemLogsQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  action?: string;
  platform?: string;
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

export const systemLogActions = [
  "ALL",
  "LOGIN",
  "LOGOUT",
  "LOGIN_FAILED",
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

export async function fetchSystemLogs(params: SystemLogsQuery = {}): Promise<SystemLogListResponse> {
  const response = await api.get<SystemLogListResponse>("/system-logs", { params });
  return response.data;
}

export function formatSystemLogAction(action: string): string {
  return (action || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

export function normalizeRoleLabel(role?: string): string {
  const value = (role || "unknown").toLowerCase();
  const map: Record<string, string> = {
    admin: "Admin",
    doctor: "Doctor",
    midwife: "Midwife",
    bhw: "BHW",
    resident: "Resident",
    unknown: "Unknown",
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
