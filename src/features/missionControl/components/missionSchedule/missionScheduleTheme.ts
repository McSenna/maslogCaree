import { useMemo } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import {
  NEUTRAL_SERVICE_TONE_DARK,
  NEUTRAL_SERVICE_TONE_LIGHT,
  SERVICE_TONES_DARK,
  SERVICE_TONES_LIGHT,
} from "@/design/serviceColors";

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

    return {
      isDark,
      surface: isDark ? "#0F172A" : "#FFFFFF",
      subtle: isDark ? "#131F35" : "#F8FAFC",
      border: isDark ? "#22304A" : "#E7EDF5",
      divider: isDark ? "#1C2941" : "#EEF3FA",
      heading: isDark ? "#F8FAFC" : "#0F172A",
      body: isDark ? "#CBD5E1" : "#334155",
      muted: isDark ? "#94A3B8" : "#64748B",
      faint: isDark ? "#64748B" : "#94A3B8",
      primary: isDark ? "#3B82F6" : "#2F6BEE",
      primarySoft: isDark ? "rgba(59,130,246,0.16)" : "#EAF1FE",
      on: isDark ? "#10B981" : "#16A34A",
      off: isDark ? "#334155" : "#D6DEE9",
      danger: isDark ? "#FCA5A5" : "#DC2626",
      dangerSoft: isDark ? "rgba(220,38,38,0.14)" : "#FEF2F2",
      dangerBorder: isDark ? "rgba(220,38,38,0.32)" : "#FECACA",
      backdrop: "rgba(15,23,42,0.45)",
      shadow: {
        shadowColor: "#0F172A",
        shadowOpacity: isDark ? 0.5 : 0.12,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: 20 },
        elevation: 12,
      },
      toneFor: (categoryKey: string): IconTone => tones[categoryKey] ?? neutral,
      neutralTone: neutral,
    };
  }, [isDark]);
};

export type MissionSchedulePalette = ReturnType<typeof useMissionSchedulePalette>;
