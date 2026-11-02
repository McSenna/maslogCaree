import type { PlatformAccessSummary } from "@/config/platformAccess";

import type { PortalAccess } from "../admin/userAdmin.types";

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

/** GET /users/:id: what the View drawer and Edit dialog read. */
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
  portalAccess?: PortalAccess;
  /** Resident accounts only: the Barangay Master List record this account holds. */
  masterResidentId?: string;
  createdAt: string;
  updatedAt: string;
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  suspended: "Suspended",
  approved: "Approved",
  rejected: "Rejected",
  deactivated: "Deactivated",
};

export type StatusActionLabel = {
  action: "deactivate" | "reactivate";
  label: string;
  pendingLabel: string;
  destructive: boolean;
};

/** The drawer's status button. Requests are decided in the ID review, so they have none. */
export const statusActionFor = (user: Pick<AdminUser, "status">): StatusActionLabel | null => {
  if (SIGN_IN_READY_STATUSES.includes(user.status)) {
    return { action: "deactivate", label: "Deactivate account", pendingLabel: "Deactivating", destructive: true };
  }
  if (DISABLED_STATUSES.includes(user.status)) {
    return { action: "reactivate", label: "Reactivate account", pendingLabel: "Reactivating", destructive: false };
  }
  return null;
};
