/**
 * The one mapper from API records to display types, plus the labels and
 * counts derived from them. Import-free so `node --test` can load it.
 */
import type {
  ApiSignupRequest,
  ApiUser,
  ApiUserSummary,
  Access,
  Role,
  SignupRequest,
  User,
  UserStatus,
  UserSummary,
  UserTab,
} from "./userAdmin.types.ts";

const ROLE_FROM_API: Record<string, Role> = {
  admin: "Admin",
  doctor: "Doctor",
  midwife: "Midwife",
  bhw: "BHW",
  resident: "Resident",
};

export const ROLES: readonly Role[] = ["Admin", "Doctor", "Midwife", "BHW", "Resident"];

export const roleToApi = (role: Role): string => role.toLowerCase();

// The backend keeps older names for the same three states.
const STATUS_FROM_API: Record<string, UserStatus> = {
  active: "active",
  approved: "approved",
  inactive: "deactivated",
  deactivated: "deactivated",
  suspended: "deactivated",
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: "Active",
  approved: "Approved",
  deactivated: "Deactivated",
};

export const ACCESS_LABELS: Record<Access, string> = {
  web_and_mobile: "Web and mobile",
  mobile_only: "Mobile only",
};

/** First letter of the first two words, uppercase. */
export const initialsOf = (fullName: string): string =>
  fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

const blankToNull = (value: string | null | undefined): string | null =>
  value && value.trim() ? value.trim() : null;

/** Null for pending or rejected accounts: those belong to the request queue, not this list. */
export const toUser = (raw: ApiUser): User | null => {
  const status = STATUS_FROM_API[raw.status];
  const role = ROLE_FROM_API[raw.role];
  if (!status || !role) return null;
  return {
    id: raw._id,
    fullName: raw.fullname,
    email: raw.email,
    role,
    access: raw.platformAccess?.web ? "web_and_mobile" : "mobile_only",
    location: raw.address?.trim() ?? "",
    status,
    avatarUrl: blankToNull(raw.profilePhoto),
    createdAt: raw.createdAt,
    lastLoginAt: blankToNull(raw.lastLogin),
  };
};

export const toUsers = (records: readonly ApiUser[]): User[] =>
  records.map(toUser).filter((user): user is User => user !== null);

export const toSignupRequest = (raw: ApiSignupRequest): SignupRequest => ({
  id: raw._id,
  fullName: raw.resident.fullname,
  email: raw.resident.email,
  // Only residents sign up through the app; staff accounts are made by an admin.
  role: "Resident",
  location: raw.resident.address?.trim() ?? "",
  status: raw.verificationStatus === "rejected" ? "rejected" : "pending",
  submittedAt: raw.registeredAt,
  avatarUrl: blankToNull(raw.resident.avatarUrl),
});

// NOTE: the brief's summary has no "approved" field, yet the Active users tab
// counts active + approved. Folding approved into `active` keeps the Active
// card, its percentage and the tab badge on the same number.
export const toSummary = (raw: ApiUserSummary): UserSummary => ({
  total: raw.total,
  staff: raw.staff,
  residents: raw.residents,
  active: raw.active + raw.approved,
  addedThisMonth: raw.addedThisMonth,
  deactivated: raw.deactivated,
  pendingRequests: raw.pendingRequests,
  rejectedRequests: raw.rejectedRequests,
});

export const TAB_COUNT: Record<UserTab, (summary: UserSummary) => number> = {
  active: (summary) => summary.active,
  requests: (summary) => summary.pendingRequests,
  rejected: (summary) => summary.rejectedRequests,
  deactivated: (summary) => summary.deactivated,
  masterlist: (summary) => summary.total,
};

export const activeShareNote = (summary: UserSummary): string =>
  summary.total === 0
    ? "No accounts yet"
    : `${Math.round((summary.active / summary.total) * 100)}% of all accounts`;
