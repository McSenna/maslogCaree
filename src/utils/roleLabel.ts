import type { UserRole } from "@/data/mockUsers";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  doctor: "Doctor",
  midwife: "Midwife",
  bhw: "BHW",
  resident: "Resident",
};

export const formatRoleLabel = (role?: string | null): string => {
  if (!role) return "";

  const key = role.trim().toLowerCase() as UserRole;
  if (ROLE_LABELS[key]) return ROLE_LABELS[key];

  return key.charAt(0).toUpperCase() + key.slice(1);
};
