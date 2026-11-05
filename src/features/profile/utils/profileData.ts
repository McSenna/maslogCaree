import { civilStatusLabel } from "@/config/civilStatus";
import type { UserRole } from "@/config/roleRoutes";
import type { CurrentUser } from "@/contexts/AuthContext";
import { formatDate } from "@/utils/dateFormatter";
import { getProfileRoleConfig, type ProfileRoleConfig } from "../config/profileRoleConfig";
import type { ProfileFieldValues } from "../config/profileFields";
import { buildProfileSections, type ProfileSection } from "./buildProfileSections";
import {
  buildDisplayId,
  calculateAge,
  getCreationDateFromId,
  getInitials,
  titleCase,
} from "./profileHelpers";

export type ProfileData = {
  roleId: UserRole;
  role: ProfileRoleConfig;
  name: string;
  email: string;
  address: string | null;
  avatarUrl: string | null;
  initials: string;
  displayId: string;
  verified: boolean;
  sections: ProfileSection[];
};

const blankToNull = (value?: string | null) => value?.trim() || null;

/** Undefined stays undefined: the server has not answered yet, which is not the same as blank. */
const optional = (value: string | undefined, read: (present: string) => string) =>
  value === undefined ? undefined : blankToNull(read(value));

const describeAge = (age: number | null) => {
  if (age === null) return null;
  return age === 1 ? "1 year old" : `${age} years old`;
};

const toFieldValues = (user: CurrentUser, role: ProfileRoleConfig): ProfileFieldValues => {
  const joined = getCreationDateFromId(user.id);

  return {
    fullName: blankToNull(user.name),
    dateOfBirth: user.dateOfBirth ? formatDate(user.dateOfBirth) : null,
    age: describeAge(calculateAge(user.dateOfBirth)),
    gender: titleCase(user.gender),
    address: blankToNull(user.address),
    civilStatus: optional(user.civilStatus, civilStatusLabel),
    houseOrPurok: optional(user.houseOrPurok, (value) => value),
    email: blankToNull(user.email),
    phone: blankToNull(user.phone),
    role: role.label,
    dateJoined: joined ? formatDate(joined) : null,
    accountStatus: user.verified ? "Active" : "Pending",
  };
};

export const buildProfileData = (user: CurrentUser): ProfileData => {
  const role = getProfileRoleConfig(user.role);

  return {
    roleId: user.role,
    role,
    name: user.name?.trim() || "MaslogCare User",
    email: user.email?.trim() || "",
    address: blankToNull(user.address),
    avatarUrl: user.avatarUrl ?? null,
    initials: getInitials(user.name),
    displayId: buildDisplayId(user.id, role.idPrefix),
    verified: Boolean(user.verified),
    sections: buildProfileSections(role.sections, toFieldValues(user, role)),
  };
};
