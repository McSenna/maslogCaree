import type { Feather } from "@expo/vector-icons";
import type { UserRole } from "@/config/roleRoutes";
import { PROFILE_COLORS } from "./profileTheme";

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
  label: string;
  title: string;
  idLabel: string;
  idPrefix: string;
  badge: RoleBadgeStyle;
  tagline: string;
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

export const getProfileRoleConfig = (role?: string | null): ProfileRoleConfig => {
  const key = typeof role === "string" ? (role.trim().toLowerCase() as UserRole) : null;
  return (key && PROFILE_ROLE_CONFIG[key]) || PROFILE_ROLE_CONFIG.resident;
};
