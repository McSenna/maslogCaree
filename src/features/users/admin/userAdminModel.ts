/**
 * The one mapper from API records to display types, plus the labels and
 * counts derived from them. Import-free so `node --test` can load it.
 */
import type { ApiUser, ApiUserSummary, Role, StatusFilter, User, UserSegment, UserStatus, UserSummary, UserTab } from "./userAdmin.types.ts";

const ROLE_FROM_API: Record<string, Role> = {
  admin: "Admin",
  doctor: "Doctor",
  midwife: "Midwife",
  bhw: "BHW",
  resident: "Resident",
};

export const ROLES: readonly Role[] = ["Admin", "Doctor", "Midwife", "BHW", "Resident"];

export const roleToApi = (role: Role): string => role.toLowerCase();

export const STATUS_LABELS: Record<UserStatus, string> = {
  requested: "Requested",
  approved: "Approved",
  active: "Active",
  rejected: "Rejected",
  deactivated: "Deactivated",
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

const blankToNull = (value: string | null | undefined): string | null => (value && value.trim() ? value.trim() : null);

export const toUser = (raw: ApiUser): User | null => {
  const role = ROLE_FROM_API[raw.role];
  if (!role) return null;
  return {
    id: raw.id,
    fullName: raw.fullname,
    email: raw.email,
    role,
    status: raw.statusGroup,
    location: raw.location?.trim() ?? "",
    avatarUrl: blankToNull(raw.avatarUrl),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    lastLoginAt: blankToNull(raw.lastLogin),
    verificationId: raw.verificationId,
    portalAccess: raw.portalAccess,
  };
};

export const toUsers = (records: readonly ApiUser[]): User[] =>
  records.map(toUser).filter((user): user is User => user !== null);

export const toSummary = (raw: ApiUserSummary): UserSummary => raw;

// Masterlist counts official records separately from user accounts.
export const TAB_COUNT: Partial<Record<UserTab, (summary: UserSummary) => number>> = {
  active: (summary) => summary.active,
  requests: (summary) => summary.requests,
  rejected: (summary) => summary.rejected,
  deactivated: (summary) => summary.deactivated,
  accounts: (summary) => summary.total,
};

export const activeShareNote = (summary: UserSummary): string =>
  summary.total === 0 ? "No accounts yet" : `${summary.activePercent}% of accounts`;

export const segmentOf = (tab: UserTab): UserSegment => (tab === "accounts" || tab === "masterlist" ? "all" : tab);

export const statusParamOf = (status: StatusFilter): UserStatus | undefined => (status === "all" ? undefined : status);

const TAB_STATUSES: Record<UserTab, readonly UserStatus[]> = {
  active: ["approved", "active"],
  requests: [],
  rejected: [],
  deactivated: [],
  accounts: ["requested", "approved", "active", "rejected", "deactivated"],
  masterlist: [],
};

/** The statuses worth filtering by in this list; a list of one state has none. */
export const statusOptionsFor = (tab: UserTab): readonly UserStatus[] => TAB_STATUSES[tab];

/** Removing the last row on a last page moves back a page rather than showing an empty table. */
export const pageAfterChange = (page: number, total: number, pageSize: number): number =>
  Math.min(page, Math.max(1, Math.ceil(total / pageSize)));
