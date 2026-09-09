import api from "@/services/api";
import type { PlatformAccessSummary } from "@/config/platformAccess";

export type UserStatus = "active" | "inactive" | "pending" | "suspended";

export interface AdminUser {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  address: string;
  verified: boolean;
  /**
   * Account standing set by an administrator — distinct from `verified`,
   * which only means the email address was confirmed. Always present: the
   * server resolves it for accounts created before the field existed.
   */
  status: UserStatus;
  role: "admin" | "doctor" | "midwife" | "bhw" | "resident";
  /**
   * Last successful sign-in. Absent for accounts that have never signed in,
   * and for accounts that last signed in before the field was recorded — the
   * UI shows "Never" rather than guessing from `updatedAt`.
   */
  lastLogin?: string | null;
  /**
   * Which clients this account may sign in from, computed by the server from
   * the role. Present on every user the API returns; the local policy mirror
   * is the fallback for a payload written before this field existed.
   */
  platformAccess?: PlatformAccessSummary;
  createdAt: string;
  updatedAt: string;
}

interface GetAllUsersResponse {
  success: boolean;
  count: number;
  users: AdminUser[];
}

interface UpdateUserStatusResponse {
  success: boolean;
  message: string;
  user: AdminUser;
}

export const getAllUsers = async (): Promise<{ count: number; users: AdminUser[] }> => {
  const { data } = await api.get<GetAllUsersResponse>("/users");
  return {
    count: data.count ?? 0,
    users: data.users ?? [],
  };
};

/** Admin-only. The server refuses a self-targeted disable and audit-logs the change. */
export const updateUserStatus = async (
  userId: string,
  status: UserStatus
): Promise<{ user: AdminUser; message: string }> => {
  const { data } = await api.patch<UpdateUserStatusResponse>(`/users/${userId}/status`, { status });
  return { user: data.user, message: data.message };
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  suspended: "Suspended",
};

/**
 * The status an action moves an account to, plus the copy the confirmation
 * modal shows. Kept beside the type so a new status can't be added without
 * deciding how it is presented.
 */
export const STATUS_ACTIONS: Record<
  UserStatus,
  { next: UserStatus; label: string; pendingLabel: string; destructive: boolean }
> = {
  active: {
    next: "inactive",
    label: "Deactivate User",
    pendingLabel: "Deactivating…",
    destructive: true,
  },
  inactive: {
    next: "active",
    label: "Activate User",
    pendingLabel: "Activating…",
    destructive: false,
  },
  pending: {
    next: "active",
    label: "Approve User",
    pendingLabel: "Approving…",
    destructive: false,
  },
  suspended: {
    next: "active",
    label: "Restore Account",
    pendingLabel: "Restoring…",
    destructive: false,
  },
};
