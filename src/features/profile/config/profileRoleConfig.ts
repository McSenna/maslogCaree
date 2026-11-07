import type { UserRole } from "@/config/roleRoutes";

import {
  RESIDENT_SECTIONS,
  STAFF_SECTIONS,
  type ProfileSectionDefinition,
} from "./profileSections.ts";

export type ProfileRoleConfig = {
  label: string;
  title: string;
  idLabel: string;
  idPrefix: string;
  sections: ProfileSectionDefinition[];
};

/** Adding a role takes one entry here; no component reads the role itself. */
export const PROFILE_ROLE_CONFIG: Record<UserRole, ProfileRoleConfig> = {
  admin: {
    label: "Admin",
    title: "Admin Profile",
    idLabel: "Admin ID",
    idPrefix: "ADM",
    sections: STAFF_SECTIONS,
  },
  doctor: {
    label: "Doctor",
    title: "Doctor Profile",
    idLabel: "Doctor ID",
    idPrefix: "DOC",
    sections: STAFF_SECTIONS,
  },
  midwife: {
    label: "Midwife",
    title: "Midwife Profile",
    idLabel: "Midwife ID",
    idPrefix: "MID",
    sections: STAFF_SECTIONS,
  },
  bhw: {
    label: "BHW",
    title: "BHW Profile",
    idLabel: "BHW ID",
    idPrefix: "BHW",
    sections: STAFF_SECTIONS,
  },
  resident: {
    label: "Resident",
    title: "My Profile",
    idLabel: "Resident ID",
    idPrefix: "RES",
    sections: RESIDENT_SECTIONS,
  },
};

export const getProfileRoleConfig = (role?: string | null): ProfileRoleConfig => {
  const key = typeof role === "string" ? (role.trim().toLowerCase() as UserRole) : null;
  return (key && PROFILE_ROLE_CONFIG[key]) || PROFILE_ROLE_CONFIG.resident;
};
