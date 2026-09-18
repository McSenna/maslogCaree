import type { CurrentUser } from "@/contexts/AuthContext";
import {
  EMPTY_EDIT_PROFILE_VALUES,
  type EditProfileValues,
} from "../config/profileEditSections";

const ISO_DATE = /^(\d{4}-\d{2}-\d{2})/;

export const toDateInputValue = (value?: string | Date | null): string => {
  if (!value) return "";

  if (typeof value === "string") {
    const matched = ISO_DATE.exec(value);
    if (matched) return matched[1];
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const splitFullName = (fullname?: string | null) => {
  const parts = (fullname ?? "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return { firstName: "", middleName: "", surname: "" };
  if (parts.length === 1) return { firstName: parts[0], middleName: "", surname: "" };

  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(" "),
    surname: parts[parts.length - 1],
  };
};

const resolveNameParts = (user: CurrentUser) => {
  const firstName = user.firstName?.trim() ?? "";
  const surname = user.surname?.trim() ?? "";

  if (firstName || surname) {
    return { firstName, middleName: user.middleName?.trim() ?? "", surname };
  }

  return splitFullName(user.name);
};

export const buildEditProfileValues = (user: CurrentUser | null): EditProfileValues => {
  if (!user) return EMPTY_EDIT_PROFILE_VALUES;

  return {
    ...resolveNameParts(user),
    dateOfBirth: toDateInputValue(user.dateOfBirth),
    gender: (user.gender ?? "").trim().toLowerCase(),
    phone: user.phone ?? "",
    address: user.address ?? "",
  };
};
