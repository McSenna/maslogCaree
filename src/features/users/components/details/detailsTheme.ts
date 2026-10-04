import { useMemo } from "react";
import type { Feather } from "@expo/vector-icons";
import type { AdminUser } from "@/features/users/services/userService";
import { useUsersPalette } from "../usersTheme";
import { PALETTE, withAlpha } from "@/theme/palette";

export const useUserDetailsPalette = () => {
  const palette = useUsersPalette();

  return useMemo(() => {
    const isDark = palette.isDark;

    return {
      ...palette,
      headerWell: isDark ? withAlpha(PALETTE.blue[600], 0.18) : PALETTE.blue[50],
      headerIcon: isDark ? PALETTE.blue[300] : PALETTE.blue[600],
      heroTop: isDark ? PALETTE.slate[900] : PALETTE.blue[50],
      heroBorder: isDark ? PALETTE.slate[700] : PALETTE.blue[100],
      avatarRing: isDark ? PALETTE.slate[800] : PALETTE.white,
      infoWell: isDark ? withAlpha(PALETTE.blue[600], 0.16) : PALETTE.blue[50],
      infoIcon: isDark ? PALETTE.blue[300] : PALETTE.blue[600],
      permissionBg: isDark ? withAlpha(PALETTE.blue[600], 0.10) : PALETTE.slate[50],
      permissionBorder: isDark ? withAlpha(PALETTE.blue[600], 0.28) : PALETTE.success[100],
      enabled: isDark ? PALETTE.success[300] : PALETTE.success[600],
      disabled: isDark ? PALETTE.slate[500] : PALETTE.slate[400],
      dangerText: isDark ? PALETTE.red[300] : PALETTE.red[600],
      dangerBg: isDark ? withAlpha(PALETTE.red[500], 0.10) : PALETTE.red[50],
      dangerBorder: isDark ? withAlpha(PALETTE.red[500], 0.32) : PALETTE.red[100],
      neutralText: isDark ? PALETTE.blue[200] : PALETTE.blue[800],
      neutralBg: isDark ? withAlpha(PALETTE.slate[400], 0.10) : PALETTE.slate[50],
      neutralBorder: isDark ? PALETTE.slate[800] : PALETTE.blue[100],
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
