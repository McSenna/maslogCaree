import { useMemo } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import {
  NEUTRAL_SERVICE_TONE_DARK,
  NEUTRAL_SERVICE_TONE_LIGHT,
  SERVICE_TONES_DARK,
  SERVICE_TONES_LIGHT,
} from "@/design/serviceColors";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import { createShadow } from "@/design/shadow";
import { PALETTE, withAlpha } from "@/theme/palette";

export const MISSION_RADIUS = {
  sheet: 26,
  field: 16,
  card: 18,
  control: 14,
  pill: 999,
} as const;

export const CATEGORY_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  general_checkup: "stethoscope",
  prenatal: "mother-heart",
  immunization: "needle",
  consultation: "chat-processing-outline",
  bp_checking: "heart-pulse",
};

export const FALLBACK_CATEGORY_ICON: keyof typeof MaterialCommunityIcons.glyphMap = "medical-bag";

type IconTone = { bg: string; fg: string };

const ICON_TONES_LIGHT = SERVICE_TONES_LIGHT;
const ICON_TONES_DARK = SERVICE_TONES_DARK;

const NEUTRAL_TONE_LIGHT: IconTone = NEUTRAL_SERVICE_TONE_LIGHT;
const NEUTRAL_TONE_DARK: IconTone = NEUTRAL_SERVICE_TONE_DARK;

export const useMissionSchedulePalette = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return useMemo(() => {
    const tones = isDark ? ICON_TONES_DARK : ICON_TONES_LIGHT;
    const neutral = isDark ? NEUTRAL_TONE_DARK : NEUTRAL_TONE_LIGHT;

    const base = getAdminDashboardPalette(resolvedTheme);

    return {
      isDark,
      surface: base.cardBg,
      subtle: isDark ? PALETTE.night.raised : PALETTE.slate[50],
      border: base.cardBorder,
      divider: base.divider,
      heading: base.heading,
      body: base.body,
      muted: base.muted,
      faint: base.subtle,
      primary: base.primary,
      primarySoft: base.tones.primary.iconBg,
      on: base.statusTones.success.fg,
      off: isDark ? PALETTE.night.lineStrong : PALETTE.slate[300],
      danger: base.statusTones.danger.fg,
      dangerSoft: base.statusTones.danger.bg,
      dangerBorder: base.statusTones.danger.border,
      backdrop: isDark ? withAlpha(PALETTE.night.page, 0.6) : withAlpha(PALETTE.ink, 0.4),
      shadow: {
        ...createShadow({
          color: PALETTE.ink,
          offsetY: 20,
          radius: 30,
          opacity: isDark ? 0.5 : 0.12,
          elevation: 12,
        }),
      },
      toneFor: (categoryKey: string): IconTone => tones[categoryKey] ?? neutral,
      neutralTone: neutral,
    };
  }, [isDark, resolvedTheme]);
};

export type MissionSchedulePalette = ReturnType<typeof useMissionSchedulePalette>;
