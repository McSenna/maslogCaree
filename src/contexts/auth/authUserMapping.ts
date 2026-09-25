import type { UserRole } from "@/config/roleRoutes";
import type { AuthUser } from "@/services/auth";
import type { StoredUser } from "@/utils/storage";

import type { CurrentUser } from "./authTypes";

const asDateString = (value: AuthUser["dateOfBirth"]) => {
  if (typeof value === "string") return value;
  return value != null ? String(value) : null;
};

export const toCurrentUser = (userData: AuthUser): CurrentUser => ({
  id: userData._id,
  name: userData.fullname,
  firstName: userData.firstName ?? "",
  middleName: userData.middleName ?? "",
  surname: userData.surname ?? "",
  suffix: userData.suffix ?? "",
  email: userData.email,
  role: userData.role as UserRole,
  dateOfBirth: asDateString(userData.dateOfBirth),
  gender: userData.gender ?? null,
  address: userData.address ?? null,
  phone: userData.phone ?? null,
  verified: userData.verified,
  avatarUrl: userData.avatarUrl ?? null,
});

export const toStoredUser = (
  currentUser: CurrentUser,
  userData: AuthUser,
  token: string
): StoredUser => ({
  id: currentUser.id,
  name: currentUser.name,
  firstName: currentUser.firstName,
  middleName: currentUser.middleName,
  surname: currentUser.surname,
  suffix: currentUser.suffix,
  email: currentUser.email,
  role: currentUser.role,
  token,
  dateOfBirth: currentUser.dateOfBirth ?? undefined,
  gender: userData.gender,
  address: userData.address,
  phone: userData.phone,
  verified: userData.verified,
  avatarUrl: userData.avatarUrl ?? undefined,
});

export const fromStoredUser = (stored: StoredUser): CurrentUser => ({
  id: stored.id,
  name: stored.name,
  firstName: stored.firstName ?? "",
  middleName: stored.middleName ?? "",
  surname: stored.surname ?? "",
  suffix: stored.suffix ?? "",
  email: stored.email ?? "",
  role: stored.role as UserRole,
  dateOfBirth: stored.dateOfBirth ?? null,
  gender: stored.gender ?? null,
  address: stored.address ?? null,
  phone: stored.phone ?? null,
  verified: stored.verified,
  avatarUrl: stored.avatarUrl ?? null,
});
