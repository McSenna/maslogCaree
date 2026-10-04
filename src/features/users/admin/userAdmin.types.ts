/** Display types for the admin Users screen. `userAdminModel.ts` builds them from API records. */

export type Role = "Admin" | "Doctor" | "Midwife" | "BHW" | "Resident";
export type Access = "web_and_mobile" | "mobile_only";
export type UserStatus = "active" | "approved" | "deactivated";
export type RequestStatus = "pending" | "rejected";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  access: Access;
  location: string;
  status: UserStatus;
  avatarUrl: string | null;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface SignupRequest {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  location: string;
  status: RequestStatus;
  submittedAt: string;
  avatarUrl: string | null;
}

export interface UserSummary {
  total: number;
  staff: number;
  residents: number;
  /** Accounts that can sign in: staff marked active plus approved residents. */
  active: number;
  addedThisMonth: number;
  deactivated: number;
  pendingRequests: number;
  rejectedRequests: number;
}

/** "accounts" lists every user account; "masterlist" is the separate Barangay Master List of official records. */
export type UserTab = "active" | "requests" | "rejected" | "deactivated" | "accounts" | "masterlist";
export type UserSort = "last_login_desc" | "last_login_asc" | "name_asc" | "joined_desc";
export type RoleFilter = Role | "all";
export type StatusFilter = UserStatus | "all";
export type StatusAction = "deactivate" | "reactivate";

/** The window rect of the button a menu opened from, and how to hand focus back to it on dismiss. */
export type MenuAnchor = { x: number; y: number; width: number; height: number; returnFocus: () => void };

export interface UserListParams {
  tab: UserTab;
  query: string;
  role: RoleFilter;
  status: StatusFilter;
  sort: UserSort;
  page: number;
  pageSize: number;
}

/** The backend's user record, trimmed to the fields this screen reads. */
export interface ApiUser {
  _id: string;
  fullname: string;
  email: string;
  role: string;
  status: string;
  address?: string;
  profilePhoto?: string | null;
  platformAccess?: { web: boolean; mobile: boolean };
  createdAt: string;
  lastLogin?: string | null;
}

export interface ApiSignupRequest {
  _id: string;
  verificationStatus: string;
  registeredAt: string;
  resident: { fullname: string; email: string; address: string; avatarUrl?: string | null };
}

export interface ApiUserSummary {
  total: number;
  staff: number;
  residents: number;
  active: number;
  approved: number;
  deactivated: number;
  addedThisMonth: number;
  pendingRequests: number;
  rejectedRequests: number;
}
