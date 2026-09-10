import { useMemo } from "react";
import type { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { type BadgeTone } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { AdminUser, UserStatus } from "@/features/users/services/userService";

/**
 * Colours for User Management.
 *
 * Built on the admin dashboard palette rather than a second one, the same way
 * System Logs is: the admin area is specified against a cool near-white page
 * (#F8FBFF) with blue-tinted borders, so a screen assembled from Tailwind's
 * neutral greys reads as a foreign page dropped into the dashboard. Everything
 * added here is a tint derived to sit on one of those surfaces.
 */

export type Role = AdminUser["role"];

/** Role identity is shared by the desktop table and the mobile cards. */
const ROLE_TONES_LIGHT: Record<Role, BadgeTone> = {
  admin: { label: "Admin", text: "#1D4ED8", bg: "#E5F0FF" },
  doctor: { label: "Doctor", text: "#0369A1", bg: "#E0F2FE" },
  midwife: { label: "Midwife", text: "#BE185D", bg: "#FCE7F3" },
  bhw: { label: "BHW", text: "#15803D", bg: "#DCFCE7" },
  resident: { label: "Resident", text: "#B45309", bg: "#FEF3C7" },
};

const ROLE_TONES_DARK: Record<Role, BadgeTone> = {
  admin: { label: "Admin", text: "#93C5FD", bg: "rgba(37,99,235,0.18)" },
  doctor: { label: "Doctor", text: "#7DD3FC", bg: "rgba(3,105,161,0.20)" },
  midwife: { label: "Midwife", text: "#F9A8D4", bg: "rgba(190,24,93,0.20)" },
  bhw: { label: "BHW", text: "#86EFAC", bg: "rgba(21,128,61,0.20)" },
  resident: { label: "Resident", text: "#FCD34D", bg: "rgba(180,83,9,0.20)" },
};

/** Full role names, for screen readers and the details panel. */
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

const STATUS_TONES_LIGHT: Record<UserStatus, BadgeTone> = {
  active: { label: "Active", text: "#15803D", bg: "#DCFCE7", dot: "#22C55E" },
  pending: { label: "Pending", text: "#B45309", bg: "#FEF3C7", dot: "#F59E0B" },
  inactive: { label: "Inactive", text: "#BE123C", bg: "#FFE4E6", dot: "#F43F5E" },
  suspended: { label: "Suspended", text: "#991B1B", bg: "#FEE2E2", dot: "#DC2626" },
};

const STATUS_TONES_DARK: Record<UserStatus, BadgeTone> = {
  active: { label: "Active", text: "#86EFAC", bg: "rgba(34,197,94,0.16)", dot: "#34D399" },
  pending: { label: "Pending", text: "#FCD34D", bg: "rgba(245,158,11,0.16)", dot: "#FBBF24" },
  inactive: { label: "Inactive", text: "#FDA4AF", bg: "rgba(244,63,94,0.16)", dot: "#FB7185" },
  suspended: { label: "Suspended", text: "#FCA5A5", bg: "rgba(220,38,38,0.18)", dot: "#F87171" },
};

export type MetricKey = "total" | "active" | "new" | "suspended";

export type MetricTone = { iconBg: string; icon: string };

const METRIC_TONES_LIGHT: Record<MetricKey, MetricTone> = {
  total: { iconBg: "#DBEAFE", icon: "#2563EB" },
  active: { iconBg: "#DCFCE7", icon: "#16A34A" },
  new: { iconBg: "#DBEAFE", icon: "#2563EB" },
  suspended: { iconBg: "#FFE4E6", icon: "#F43F5E" },
};

const METRIC_TONES_DARK: Record<MetricKey, MetricTone> = {
  total: { iconBg: "rgba(37,99,235,0.20)", icon: "#60A5FA" },
  active: { iconBg: "rgba(22,163,74,0.20)", icon: "#34D399" },
  new: { iconBg: "rgba(37,99,235,0.20)", icon: "#60A5FA" },
  suspended: { iconBg: "rgba(244,63,94,0.20)", icon: "#FB7185" },
};

export const METRIC_ICONS: Record<MetricKey, keyof typeof Feather.glyphMap> = {
  total: "users",
  active: "user",
  new: "plus",
  suspended: "user-x",
};

/** Trend pill fills, keyed by direction rather than by metric. */
const TREND_TONES_LIGHT = {
  up: { text: "#15803D", bg: "#DCFCE7" },
  down: { text: "#BE123C", bg: "#FFE4E6" },
} as const;

const TREND_TONES_DARK = {
  up: { text: "#86EFAC", bg: "rgba(34,197,94,0.16)" },
  down: { text: "#FDA4AF", bg: "rgba(244,63,94,0.16)" },
} as const;

export type UsersPalette = ReturnType<typeof useUsersPalette>;

export function useUsersPalette() {
  const surface = useAdminSurfacePalette();

  return useMemo(() => {
    const { isDark } = surface;

    return {
      ...surface,
      roles: isDark ? ROLE_TONES_DARK : ROLE_TONES_LIGHT,
      statuses: isDark ? STATUS_TONES_DARK : STATUS_TONES_LIGHT,
      metrics: isDark ? METRIC_TONES_DARK : METRIC_TONES_LIGHT,
      trends: isDark ? TREND_TONES_DARK : TREND_TONES_LIGHT,
    };
  }, [surface]);
}

// Surface tokens are shared with Inventory and System Logs; they live in the
// design layer and are re-exported here so this module keeps one import site.
export { CARD_SHADOW, CONTROL_HEIGHT, RADIUS } from "@/design/adminSurfaces";
export type { BadgeTone } from "@/design/adminSurfaces";
