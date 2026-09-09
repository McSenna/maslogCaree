import type { UserRole } from "@/data/mockUsers";

/**
 * Presentation label for a stored role value.
 *
 * The database keeps roles lowercase (`admin`, `bhw`, …); the UI shows them
 * title-cased, except acronyms which stay uppercase.
 */
const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  doctor: "Doctor",
  midwife: "Midwife",
  bhw: "BHW",
  resident: "Resident",
};

export function formatRoleLabel(role?: string | null): string {
  if (!role) return "";

  const key = role.trim().toLowerCase() as UserRole;
  if (ROLE_LABELS[key]) return ROLE_LABELS[key];

  return key.charAt(0).toUpperCase() + key.slice(1);
}
