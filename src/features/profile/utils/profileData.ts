import type { CurrentUser } from "@/contexts/AuthContext";
import { formatDate } from "@/utils/dateFormatter";
import {
  PROFILE_FIELDS,
  getProfileRoleConfig,
  type ProfileFieldKey,
  type ProfileRoleConfig,
} from "../config/profileRoleConfig";
import {
  NOT_PROVIDED,
  buildDisplayId,
  calculateAge,
  getCreationDateFromId,
  getInitials,
  titleCase,
} from "./profileHelpers";

export {
  NOT_PROVIDED,
  buildDisplayId,
  calculateAge,
  getCreationDateFromId,
  getInitials,
} from "./profileHelpers";

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
  verified: boolean;
  age: number | null;
  joinedOn: string | null;
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
    default:
      return null;
  }
};

export const buildProfileData = (user: CurrentUser): ProfileData => {
  const role = getProfileRoleConfig(user.role);
  const displayId = buildDisplayId(user.id, role.idPrefix);
  const accountStatus = user.verified ? "Active" : "Pending";
  const createdAt = getCreationDateFromId(user.id);

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
    verified: Boolean(user.verified),
    age: calculateAge(user.dateOfBirth),
    joinedOn: createdAt ? formatDate(createdAt) : null,
    fields,
  };
};
