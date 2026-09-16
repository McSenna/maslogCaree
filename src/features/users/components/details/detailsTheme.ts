import { useMemo } from "react";
import type { Feather } from "@expo/vector-icons";
import type { AdminUser } from "@/features/users/services/userService";
import { useUsersPalette } from "../usersTheme";

export const useUserDetailsPalette = () => {
  const palette = useUsersPalette();

  return useMemo(() => {
    const isDark = palette.isDark;

    return {
      ...palette,
      headerWell: isDark ? "rgba(37,99,235,0.18)" : "#EAF2FF",
      headerIcon: isDark ? "#93C5FD" : "#2563EB",
      heroTop: isDark ? "#0B2038" : "#EAF4FE",
      heroBottom: isDark ? "#0D1B2E" : "#F1F8FF",
      heroBorder: isDark ? "#1E3A5F" : "#DCEBFB",
      avatarRing: isDark ? "#132B45" : "#FFFFFF",
      infoWell: isDark ? "rgba(37,99,235,0.16)" : "#EFF6FF",
      infoIcon: isDark ? "#93C5FD" : "#2563EB",
      permissionBg: isDark ? "rgba(22,163,74,0.10)" : "#F2FBF5",
      permissionBorder: isDark ? "rgba(22,163,74,0.28)" : "#DCF3E4",
      enabled: isDark ? "#4ADE80" : "#16A34A",
      disabled: isDark ? "#64748B" : "#94A3B8",
      dangerText: isDark ? "#FCA5A5" : "#DC2626",
      dangerBg: isDark ? "rgba(239,68,68,0.10)" : "#FEF2F2",
      dangerBorder: isDark ? "rgba(239,68,68,0.32)" : "#FCDCDC",
      neutralText: isDark ? "#BFDBFE" : "#1E40AF",
      neutralBg: isDark ? "rgba(148,163,184,0.10)" : "#F7FAFF",
      neutralBorder: isDark ? "#1E293B" : "#E3EAF5",
      isDark,
    };
  }, [palette]);
};

export type UserDetailsPalette = ReturnType<typeof useUserDetailsPalette>;

export const ROLE_PERMISSIONS: Record<AdminUser["role"], string> = {
  admin:
    "Manage users, system settings, healthcare services, reports, appointments, roles, and administrative functions.",
  doctor:
    "Access assigned patients, appointments, healthcare records, consultation information, and authorized medical features.",
  midwife:
    "Access maternal health information, assigned patients, appointment schedules, health records, and permitted clinical functions.",
  bhw: "Access assigned residents, community health records, appointments, monitoring tools, and authorized healthcare functions.",
  resident:
    "Access their own profile, appointments, notifications, and permitted healthcare services.",
};

export const HERO_TAGLINE = "“A healthier community, a brighter tomorrow.”";

export const DETAIL_RADIUS = {
  modal: 20,
  hero: 18,
  card: 14,
  well: 10,
  control: 12,
} as const;

export type InfoIcon = keyof typeof Feather.glyphMap;
