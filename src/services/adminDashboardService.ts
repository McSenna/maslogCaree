import api from "@/services/api";

export type DashboardRole = "admin" | "doctor" | "midwife" | "bhw" | "resident";

export interface DashboardMetrics {
  totalUsers: number;
  totalUsersGrowth: number;
  activeUsers: number;
  activeUsersGrowth: number;
  newUsersLast30Days: number;
  newUsersGrowth: number;
  totalPatients: number;
  totalPatientsGrowth: number;
}

export interface RoleDistributionEntry {
  role: DashboardRole;
  label: string;
  count: number;
}

export interface DashboardUser {
  _id: string;
  fullname: string;
  email: string;
  profilePhoto?: string;
  role: DashboardRole;
  verified: boolean;
  createdAt: string;
}

export interface DashboardActivity {
  _id: string;
  action: string;
  actorName: string;
  role: string;
  description?: string;
  resource?: string;
  platform?: string;
  success: boolean;
  createdAt: string;
}

export interface TrendPoint {
  key: string;
  label: string;
  count: number;
}

export interface AdminDashboardData {
  metrics: DashboardMetrics;
  roleDistribution: RoleDistributionEntry[];
  registrationTrend: TrendPoint[];
  activityTrend: TrendPoint[];
  recentUsers: DashboardUser[];
  recentActivities: DashboardActivity[];
  generatedAt: string;
}

interface AdminDashboardResponse extends AdminDashboardData {
  success: boolean;
  message: string;
}

const EMPTY_METRICS: DashboardMetrics = {
  totalUsers: 0,
  totalUsersGrowth: 0,
  activeUsers: 0,
  activeUsersGrowth: 0,
  newUsersLast30Days: 0,
  newUsersGrowth: 0,
  totalPatients: 0,
  totalPatientsGrowth: 0,
};

export interface AdminDashboardQuery {
  usersLimit?: number;
  activitiesLimit?: number;
}

export const fetchAdminDashboard = async (
  params: AdminDashboardQuery = {}
): Promise<AdminDashboardData> => {
  const { data } = await api.get<AdminDashboardResponse>("/admin/dashboard", { params });

  return {
    metrics: { ...EMPTY_METRICS, ...(data.metrics ?? {}) },
    roleDistribution: data.roleDistribution ?? [],
    registrationTrend: data.registrationTrend ?? [],
    activityTrend: data.activityTrend ?? [],
    recentUsers: data.recentUsers ?? [],
    recentActivities: data.recentActivities ?? [],
    generatedAt: data.generatedAt ?? new Date().toISOString(),
  };
};

const ACTION_LABELS: Record<string, string> = {
  LOGIN: "User logged in",
  LOGOUT: "User logged out",
  LOGIN_FAILED: "Failed login attempt",
  RESIDENT_WEB_LOGIN_BLOCKED: "Resident web login blocked",
  PLATFORM_ACCESS_DENIED: "Platform access denied",
  USER_CREATED: "New user created",
  USER_UPDATED: "Profile updated",
  USER_DELETED: "User deleted",
  USER_ROLE_CHANGED: "User role changed",
  USER_VERIFIED: "User activated",
  PASSWORD_RESET_REQUESTED: "Password reset requested",
  PASSWORD_CHANGED: "Password changed",
  USER_UNVERIFIED: "User deactivated",
  APPOINTMENT_CREATED: "Appointment requested",
  APPOINTMENT_UPDATED: "Appointment updated",
  APPOINTMENT_APPROVED: "Appointment approved",
  APPOINTMENT_REJECTED: "Appointment rejected",
  APPOINTMENT_CANCELLED: "Appointment cancelled",
  APPOINTMENT_RESCHEDULED: "Appointment rescheduled",
  RECORD_CREATED: "Record created",
  RECORD_UPDATED: "Record updated",
  RECORD_VIEWED: "Record viewed",
  SCHEDULE_CREATED: "Schedule created",
  SCHEDULE_UPDATED: "Schedule updated",
  SCHEDULE_DELETED: "Schedule deleted",
};

export const formatActivityTitle = (action: string): string => {
  if (ACTION_LABELS[action]) return ACTION_LABELS[action];
  return (action || "Activity")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());
};

export const formatActivityActor = (activity: DashboardActivity): string => {
  if (activity.actorName?.trim()) return activity.actorName.trim();
  if (activity.role && activity.role !== "unknown") {
    return activity.role.charAt(0).toUpperCase() + activity.role.slice(1);
  }
  return "System";
};
