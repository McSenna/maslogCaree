import { useMemo } from "react";
import type { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { statusBadge, toneBadge, type BadgeTone } from "@/design/adminSurfaces";
import { ROLE_TONE } from "@/design/adminDashboardTheme";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { AdminUser, UserStatus } from "@/features/users/services/userService";

export type Role = AdminUser["role"];

export const ROLE_FULL_LABELS: Record<Role, string> = {
  admin: "Admin",
  doctor: "Doctor",
  midwife: "Midwife",
  bhw: "Barangay Health Worker",
  resident: "Resident",
};

export const ROLE_ICONS: Record<Role, keyof typeof MaterialCommunityIcons.glyphMap> = {
  admin: "crown-outline",
  doctor: "stethoscope",
  midwife: "heart-outline",
  bhw: "account-group-outline",
  resident: "account-outline",
};

export type MetricKey = "total" | "active" | "new" | "suspended";

export type MetricTone = { iconBg: string; icon: string };

export const METRIC_ICONS: Record<MetricKey, keyof typeof Feather.glyphMap> = {
  total: "users",
  active: "user",
  new: "plus",
  suspended: "user-x",
};

export type UsersPalette = ReturnType<typeof useUsersPalette>;

export const useUsersPalette = () => {
  const surface = useAdminSurfacePalette();

  return useMemo(() => {
    const { tones, statusTones } = surface;

    return {
      ...surface,
      roles: {
        admin: toneBadge("Admin", tones[ROLE_TONE.admin]),
        doctor: toneBadge("Doctor", tones[ROLE_TONE.doctor]),
        midwife: toneBadge("Midwife", tones[ROLE_TONE.midwife]),
        bhw: toneBadge("BHW", tones[ROLE_TONE.bhw]),
        resident: toneBadge("Resident", tones[ROLE_TONE.resident]),
      } satisfies Record<Role, BadgeTone>,
      statuses: {
        active: statusBadge("Active", statusTones.success, "check-circle"),
        approved: statusBadge("Approved", statusTones.success, "check"),
        pending: statusBadge("Pending", statusTones.warning, "clock"),
        rejected: statusBadge("Rejected", statusTones.danger, "x-circle"),
        inactive: statusBadge("Inactive", statusTones.neutral, "pause-circle"),
        deactivated: statusBadge("Deactivated", statusTones.neutral, "slash"),
        suspended: statusBadge("Suspended", statusTones.danger, "alert-octagon"),
      } satisfies Record<UserStatus, BadgeTone>,
      metrics: {
        total: { iconBg: tones.primary.iconBg, icon: tones.primary.icon },
        active: { iconBg: tones.care.iconBg, icon: tones.care.icon },
        new: { iconBg: tones.accent.iconBg, icon: tones.accent.icon },
        suspended: { iconBg: tones.danger.iconBg, icon: tones.danger.icon },
      } satisfies Record<MetricKey, MetricTone>,
      trends: surface.trends,
    };
  }, [surface]);
};

export { CARD_SHADOW, CONTROL_HEIGHT, RADIUS } from "@/design/adminSurfaces";
export type { BadgeTone } from "@/design/adminSurfaces";
