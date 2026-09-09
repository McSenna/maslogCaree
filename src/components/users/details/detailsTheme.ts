import { useMemo } from "react";
import type { Feather } from "@expo/vector-icons";
import type { AdminUser } from "@/services/userService";
import { useUsersPalette } from "../usersTheme";

/**
 * Surfaces used only by the User Details dialog.
 *
 * The dialog sits on top of the page rather than in it, so it needs a few tones
 * the table never asks for — the hero's healthcare-blue wash, the tinted wells
 * behind the information icons, and the two action-button fills. Derived from
 * the User Management palette so a theme switch carries the dialog with it
 * instead of leaving a light card floating on a dark page.
 */
export function useUserDetailsPalette() {
  const palette = useUsersPalette();

  return useMemo(() => {
    const isDark = palette.isDark;

    return {
      ...palette,
      /** Header icon tile and the close button. */
      headerWell: isDark ? "rgba(37,99,235,0.18)" : "#EAF2FF",
      headerIcon: isDark ? "#93C5FD" : "#2563EB",
      /** Hero card — a wash rather than a solid, so the artwork can show. */
      heroTop: isDark ? "#0B2038" : "#EAF4FE",
      heroBottom: isDark ? "#0D1B2E" : "#F1F8FF",
      heroBorder: isDark ? "#1E3A5F" : "#DCEBFB",
      /** Ring around the avatar, so the photo reads as a portrait, not a fill. */
      avatarRing: isDark ? "#132B45" : "#FFFFFF",
      /** Tinted square behind each information-row icon. */
      infoWell: isDark ? "rgba(37,99,235,0.16)" : "#EFF6FF",
      infoIcon: isDark ? "#93C5FD" : "#2563EB",
      /** Permission blurb, held on a calm green so it reads as "granted". */
      permissionBg: isDark ? "rgba(22,163,74,0.10)" : "#F2FBF5",
      permissionBorder: isDark ? "rgba(22,163,74,0.28)" : "#DCF3E4",
      /** Enabled / disabled platform rows. */
      enabled: isDark ? "#4ADE80" : "#16A34A",
      disabled: isDark ? "#64748B" : "#94A3B8",
      /** Soft destructive action — a bordered tint, never a solid red slab. */
      dangerText: isDark ? "#FCA5A5" : "#DC2626",
      dangerBg: isDark ? "rgba(239,68,68,0.10)" : "#FEF2F2",
      dangerBorder: isDark ? "rgba(239,68,68,0.32)" : "#FCDCDC",
      /** The neutral action beside it. */
      neutralText: isDark ? "#BFDBFE" : "#1E40AF",
      neutralBg: isDark ? "rgba(148,163,184,0.10)" : "#F7FAFF",
      neutralBorder: isDark ? "#1E293B" : "#E3EAF5",
      isDark,
    };
  }, [palette]);
}

export type UserDetailsPalette = ReturnType<typeof useUserDetailsPalette>;

/**
 * What each role may do, in the administrator's language.
 *
 * Descriptive copy for the person reading the dialog — the server stays the
 * authority on what a role can actually reach, so this text is written to
 * describe the granted surface and never to promise more than the API allows.
 */
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

/** The line under the badges in the hero. */
export const HERO_TAGLINE = "“A healthier community, a brighter tomorrow.”";

/** Rounded-square wells, cards and pills inside the dialog. */
export const DETAIL_RADIUS = {
  modal: 20,
  hero: 18,
  card: 14,
  well: 10,
  control: 12,
} as const;

export type InfoIcon = keyof typeof Feather.glyphMap;
