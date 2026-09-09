import type { CurrentUser } from "@/contexts/AuthContext";
import { formatDate } from "@/utils/dateFormatter";
import {
  PROFILE_FIELDS,
  getProfileRoleConfig,
  type ProfileFieldKey,
  type ProfileRoleConfig,
} from "../config/profileRoleConfig";

export const NOT_PROVIDED = "Not provided";

/** 24-character Mongo ObjectId, whose leading 4 bytes are the creation time. */
const OBJECT_ID = /^[0-9a-f]{24}$/i;

/**
 * Creation date encoded in a Mongo ObjectId.
 *
 * The account's `createdAt` is not part of the sign-in payload, but the id the
 * server already sent carries the same timestamp in its first four bytes — so
 * "Date Joined" is real data rather than something invented for the row.
 */
export function getCreationDateFromId(id: string | number): Date | null {
  const raw = String(id);
  if (!OBJECT_ID.test(raw)) return null;

  const seconds = parseInt(raw.slice(0, 8), 16);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;

  const date = new Date(seconds * 1000);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Human-readable identifier, e.g. `RES-2026-4C2B`.
 *
 * MaslogCare has no separate ID column, so this is derived from the account's
 * real id: the role prefix, the year the account was created, and the last four
 * characters of the id. It is stable for the life of the account and unique
 * wherever the underlying id is — no counter is fabricated. Swap this one
 * function if a dedicated identifier is added to the schema.
 */
export function buildDisplayId(
  id: string | number | null | undefined,
  prefix: string
): string {
  if (id === null || id === undefined || String(id).length === 0) {
    return NOT_PROVIDED;
  }

  const raw = String(id);
  const created = getCreationDateFromId(raw);
  const year = (created ?? new Date()).getFullYear();
  const suffix = raw.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase();

  return `${prefix}-${year}-${suffix.padStart(4, "0")}`;
}

/** Up to two initials for the avatar fallback, so no broken image is shown. */
export function getInitials(name?: string | null): string {
  const parts = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function titleCase(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export type ProfileField = {
  key: ProfileFieldKey;
  label: string;
  value: string;
  icon: (typeof PROFILE_FIELDS)[ProfileFieldKey]["icon"];
  /** False when the account has no value stored for this field. */
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
  /** "Active" / "Pending", mirroring how the server resolves account standing. */
  accountStatus: string;
  fields: ProfileField[];
};

/**
 * Resolves one Personal Information row from the signed-in user.
 *
 * Fields MaslogCare does not store yet (specialization, assigned facility,
 * position, area) resolve to `NOT_PROVIDED` rather than to invented content —
 * the row still renders so the layout is right the day the data exists.
 */
function resolveFieldValue(
  key: ProfileFieldKey,
  user: CurrentUser,
  ctx: { displayId: string; accountStatus: string }
): string | null {
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
    // Not present on the user schema today.
    case "specialization":
    case "facility":
    case "assignedArea":
      return null;
    default:
      return null;
  }
}

/**
 * Turns the authenticated user into everything the profile renders.
 *
 * The only place role branching happens is the config lookup, so all five roles
 * share one code path (§40).
 */
export function buildProfileData(user: CurrentUser): ProfileData {
  const role = getProfileRoleConfig(user.role);
  const displayId = buildDisplayId(user.id, role.idPrefix);

  // Mirrors the server's own resolveUserStatus(): verification is what decides
  // standing until an administrator sets something else.
  const accountStatus = user.verified ? "Active" : "Pending";

  const fields: ProfileField[] = role.fields.map((key) => {
    const definition = PROFILE_FIELDS[key];
    const value = resolveFieldValue(key, user, { displayId, accountStatus });

    return {
      key,
      // The identifier's label is role-specific: "Resident ID", "Doctor ID", …
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
}
