/** Display types for the admin Users screen. `userAdminModel.ts` builds them from API records. */

export type Role = "Admin" | "Doctor" | "Midwife" | "BHW" | "Resident";
export type UserStatus = "requested" | "approved" | "active" | "rejected" | "deactivated";
export type WebOverride = "allow" | "block" | null;
export type PortalState =
  | "staff"
  | "global_blocked"
  | "exception_allowed"
  | "global_allowed"
  | "individual_allowed"
  | "individual_blocked"
  | "ineligible"
  | "unavailable";

/** The server computes this; the client never works out who can sign in. */
export interface PortalAccess {
  web: boolean;
  mobile: boolean;
  override: WebOverride;
  globalEnabled: boolean;
  eligible: boolean;
  revision: number;
  state: PortalState;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  status: UserStatus;
  location: string;
  avatarUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  lastLoginAt: string | null;
  /** The ID review for this account, when a request is open or was rejected. */
  verificationId: string | null;
  portalAccess: PortalAccess;
}

export interface UserSummary {
  total: number;
  staff: number;
  residents: number;
  /** Accounts that can sign in: Approved and Active. */
  active: number;
  approved: number;
  requests: number;
  rejected: number;
  deactivated: number;
  activePercent: number;
  masterlist: number;
}

/** "accounts" is every account; "masterlist" is the separate Barangay Master List of official records. */
export type UserTab = "active" | "requests" | "rejected" | "deactivated" | "accounts" | "masterlist";
export type UserSegment = "active" | "requests" | "rejected" | "deactivated" | "all";
export type UserSort = "name_asc" | "joined_desc";
export type RoleFilter = Role | "all";
export type StatusFilter = UserStatus | "all";
export type StatusAction = "deactivate" | "reactivate" | "approve" | "reject";
export type RowActionKey = "edit" | "approve" | "reject" | "deactivate" | "reactivate" | "resetPassword" | "allowWeb" | "blockWeb";

export interface UserListParams {
  tab: UserTab;
  query: string;
  role: RoleFilter;
  status: StatusFilter;
  sort: UserSort;
  page: number;
  pageSize: number;
}

/** A row of GET /users. */
export interface ApiUser {
  id: string;
  fullname: string;
  email: string;
  role: string;
  status: string;
  statusGroup: UserStatus;
  location: string;
  avatarUrl: string | null;
  lastLogin: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  verificationId: string | null;
  portalAccess: PortalAccess;
}

export type ApiUserSummary = UserSummary;
