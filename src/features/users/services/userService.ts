import api from "@/services/api";
import type { PlatformAccessSummary } from "@/config/platformAccess";

export type UserStatus =
  | "active"
  | "inactive"
  | "pending"
  | "suspended"
  | "approved"
  | "rejected"
  | "deactivated";

export const SIGN_IN_READY_STATUSES: readonly UserStatus[] = ["active", "approved"];

export const DISABLED_STATUSES: readonly UserStatus[] = [
  "inactive",
  "deactivated",
  "suspended",
];

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
  status: UserStatus;
  role: "admin" | "doctor" | "midwife" | "bhw" | "resident";
  lastLogin?: string | null;
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
  approved: "Approved",
  rejected: "Rejected",
  deactivated: "Deactivated",
};

export type StatusAction = {
  next: UserStatus;
  label: string;
  pendingLabel: string;
  destructive: boolean;
};

const readyStatusFor = (role: AdminUser["role"]): UserStatus =>
  role === "resident" ? "approved" : "active";

export const statusActionFor = (user: Pick<AdminUser, "status" | "role">): StatusAction => {
  const ready = readyStatusFor(user.role);

  switch (user.status) {
    case "active":
    case "approved":
      return {
        next: user.role === "resident" ? "deactivated" : "inactive",
        label: "Deactivate User",
        pendingLabel: "Deactivating…",
        destructive: true,
      };

    case "inactive":
    case "deactivated":
      return {
        next: ready,
        label: "Activate User",
        pendingLabel: "Activating…",
        destructive: false,
      };

    case "suspended":
      return {
        next: ready,
        label: "Restore Account",
        pendingLabel: "Restoring…",
        destructive: false,
      };

    case "pending":
    case "rejected":
    default:
      return {
        next: ready,
        label: "Approve User",
        pendingLabel: "Approving…",
        destructive: false,
      };
  }
};
