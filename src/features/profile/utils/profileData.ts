import type { CurrentUser } from "@/contexts/AuthContext";
import { formatDate } from "@/utils/dateFormatter";
import {
  PROFILE_FIELDS,
  getProfileRoleConfig,
  type ProfileFieldKey,
  type ProfileRoleConfig,
} from "../config/profileRoleConfig";

export const NOT_PROVIDED = "Not provided";

const OBJECT_ID = /^[0-9a-f]{24}$/i;

export const getCreationDateFromId = (id: string | number): Date | null => {
  const raw = String(id);
  if (!OBJECT_ID.test(raw)) return null;

  const seconds = parseInt(raw.slice(0, 8), 16);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;

  const date = new Date(seconds * 1000);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const buildDisplayId = (
  id: string | number | null | undefined,
  prefix: string
): string => {
  if (id === null || id === undefined || String(id).length === 0) {
    return NOT_PROVIDED;
  }

  const raw = String(id);
  const created = getCreationDateFromId(raw);
  const year = (created ?? new Date()).getFullYear();
  const suffix = raw.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase();

  return `${prefix}-${year}-${suffix.padStart(4, "0")}`;
};

export const getInitials = (name?: string | null): string => {
  const parts = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const titleCase = (value?: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

export type ProfileField = {
  key: ProfileFieldKey;
  label: string;
  value: string;
  icon: (typeof PROFILE_FIELDS)[ProfileFieldKey]["icon"];
  provided: boolean;
};

export type ProfileData = {
  role: ProfileRoleConfig;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  initials: string;
  displayId: string;
  accountStatus: string;
  fields: ProfileField[];
};

const resolveFieldValue = (
  key: ProfileFieldKey,
  user: CurrentUser,
  ctx: { displayId: string; accountStatus: string }
): string | null => {
  switch (key) {
    case "fullName":
      return user.name?.trim() || null;
    case "userId":
      return ctx.displayId;
    case "address":
      return user.address?.trim() || null;
    case "phone":
      return user.phone?.trim() || null;
    case "email":
      return user.email?.trim() || null;
    case "dateOfBirth":
      return user.dateOfBirth ? formatDate(user.dateOfBirth) : null;
    case "gender":
      return titleCase(user.gender);
    case "dateJoined": {
      const created = getCreationDateFromId(user.id);
      return created ? formatDate(created) : null;
    }
    case "accountStatus":
      return ctx.accountStatus;
    case "specialization":
    case "facility":
    case "assignedArea":
      return null;
    default:
      return null;
  }
};

export const buildProfileData = (user: CurrentUser): ProfileData => {
  const role = getProfileRoleConfig(user.role);
  const displayId = buildDisplayId(user.id, role.idPrefix);

  const accountStatus = user.verified ? "Active" : "Pending";

  const fields: ProfileField[] = role.fields.map((key) => {
    const definition = PROFILE_FIELDS[key];
    const value = resolveFieldValue(key, user, { displayId, accountStatus });

    return {
      key,
      label: key === "userId" ? role.idLabel : definition.label,
      icon: definition.icon,
      value: value ?? NOT_PROVIDED,
      provided: value !== null,
    };
  });

  return {
    role,
    name: user.name?.trim() || "MaslogCare User",
    email: user.email?.trim() || "",
    phone: user.phone?.trim() || null,
    address: user.address?.trim() || null,
    avatarUrl: user.avatarUrl ?? null,
    initials: getInitials(user.name),
    displayId,
    accountStatus,
    fields,
  };
};
