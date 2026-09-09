import type { Feather } from "@expo/vector-icons";
import type { UserRole } from "@/data/mockUsers";
import { PROFILE_COLORS } from "./profileTheme";

/**
 * Every value the Personal Information card can show, across all five roles.
 *
 * Declaring the union here means a role gains or loses a row by editing one
 * array below — never by forking the card into a role-specific copy.
 */
export type ProfileFieldKey =
  | "fullName"
  | "userId"
  | "specialization"
  | "facility"
  | "assignedArea"
  | "address"
  | "phone"
  | "email"
  | "dateOfBirth"
  | "gender"
  | "dateJoined"
  | "accountStatus";

export type ProfileFieldDefinition = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
};

/**
 * Presentation for each field. `userId` carries a placeholder label because the
 * real one is role-specific ("Resident ID", "Doctor ID", …) and is substituted
 * from the role config at render time.
 */
export const PROFILE_FIELDS: Record<ProfileFieldKey, ProfileFieldDefinition> = {
  fullName: { label: "Full Name", icon: "user" },
  userId: { label: "User ID", icon: "credit-card" },
  specialization: { label: "Specialization", icon: "activity" },
  facility: { label: "Assigned Facility", icon: "home" },
  assignedArea: { label: "Assigned Purok / Area", icon: "map" },
  address: { label: "Address", icon: "map-pin" },
  phone: { label: "Contact Number", icon: "phone" },
  email: { label: "Email Address", icon: "mail" },
  dateOfBirth: { label: "Date of Birth", icon: "calendar" },
  gender: { label: "Gender", icon: "users" },
  dateJoined: { label: "Date Joined", icon: "clock" },
  accountStatus: { label: "Account Status", icon: "check-circle" },
};

export type RoleBadgeStyle = {
  background: string;
  text: string;
  border: string;
};

export type ProfileRoleConfig = {
  /** Human label — "Admin", "BHW", … */
  label: string;
  /** Modal / screen title: "Resident Profile" */
  title: string;
  /** Row label and hero caption for the identifier: "Resident ID" */
  idLabel: string;
  /** Prefix of the generated display identifier: RES-2026-4C2B */
  idPrefix: string;
  badge: RoleBadgeStyle;
  /** Short line under the name on the mobile hero. */
  tagline: string;
  /** Personal Information rows, in display order. */
  fields: ProfileFieldKey[];
};

const STAFF_FIELDS_TAIL: ProfileFieldKey[] = [
  "phone",
  "email",
  "dateJoined",
  "accountStatus",
  "dateOfBirth",
  "gender",
];

/**
 * The single source of role-aware profile content (§42).
 *
 * Nothing outside this table branches on role: the hero, the Personal
 * Information card and the titles all read from here.
 */
export const PROFILE_ROLE_CONFIG: Record<UserRole, ProfileRoleConfig> = {
  admin: {
    label: "Admin",
    title: "Admin Profile",
    idLabel: "Admin ID",
    idPrefix: "ADM",
    badge: {
      background: PROFILE_COLORS.primarySoft,
      text: PROFILE_COLORS.primary,
      border: "#DBEAFE",
    },
    tagline: "Keeping MaslogCare running for every barangay.",
    fields: ["fullName", "userId", ...STAFF_FIELDS_TAIL],
  },
  doctor: {
    label: "Doctor",
    title: "Doctor Profile",
    idLabel: "Doctor ID",
    idPrefix: "DOC",
    badge: {
      background: PROFILE_COLORS.greenSoft,
      text: PROFILE_COLORS.greenDeep,
      border: "#A7F3D0",
    },
    tagline: "Caring for a healthier Maslog, one patient at a time.",
    fields: [
      "fullName",
      "userId",
      "specialization",
      "facility",
      ...STAFF_FIELDS_TAIL,
    ],
  },
  midwife: {
    label: "Midwife",
    title: "Midwife Profile",
    idLabel: "Midwife ID",
    idPrefix: "MID",
    badge: {
      background: "#FDF2F8",
      text: "#DB2777",
      border: "#FBCFE8",
    },
    tagline: "Safe mothers, healthy babies, stronger community.",
    fields: ["fullName", "userId", "facility", ...STAFF_FIELDS_TAIL],
  },
  bhw: {
    label: "BHW",
    title: "BHW Profile",
    idLabel: "BHW ID",
    idPrefix: "BHW",
    badge: {
      background: "#F5F3FF",
      text: "#7C3AED",
      border: "#DDD6FE",
    },
    tagline: "Health care that reaches every doorstep.",
    fields: ["fullName", "userId", "assignedArea", ...STAFF_FIELDS_TAIL],
  },
  resident: {
    label: "Resident",
    title: "Resident Profile",
    idLabel: "Resident ID",
    idPrefix: "RES",
    badge: {
      background: PROFILE_COLORS.greenSoft,
      text: PROFILE_COLORS.greenDeep,
      border: "#A7F3D0",
    },
    tagline: "A healthier me for a stronger Maslog.",
    fields: [
      "fullName",
      "userId",
      "address",
      "phone",
      "email",
      "dateOfBirth",
      "gender",
    ],
  },
};

/** Unknown or missing roles fall back to the least-privileged profile. */
export function getProfileRoleConfig(role?: string | null): ProfileRoleConfig {
  const key = typeof role === "string" ? (role.trim().toLowerCase() as UserRole) : null;
  return (key && PROFILE_ROLE_CONFIG[key]) || PROFILE_ROLE_CONFIG.resident;
}
