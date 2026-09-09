import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { SystemLogSeverity, SystemLogStatus } from "@/services/systemLogService";

/**
 * System Logs colours.
 *
 * These extend the admin dashboard palette rather than defining a second one:
 * the admin area is specified against a cool near-white page (#F8FBFF) with
 * blue-tinted borders, so a screen built from Tailwind's neutral `slate`
 * greys reads as a foreign page pasted into the dashboard. Everything here
 * is either a dashboard token or a tint derived to sit on top of one.
 */

export type StatusTone = {
  label: string;
  /** Text colour — dark enough to pass contrast on `bg`. */
  text: string;
  /** Badge / icon-well fill. */
  bg: string;
  /** Vivid dot, so severity is never carried by text colour alone. */
  dot: string;
};

const SEVERITY_TONES: Record<SystemLogSeverity, StatusTone> = {
  info: { label: "Info", text: "#1E40AF", bg: "#DBEAFE", dot: "#1677FF" },
  success: { label: "Success", text: "#166534", bg: "#DCFCE7", dot: "#22C55E" },
  warning: { label: "Warning", text: "#92400E", bg: "#FEF3C7", dot: "#F59E0B" },
  error: { label: "Error", text: "#991B1B", bg: "#FEE2E2", dot: "#EF4444" },
};

const STATUS_TONES: Record<SystemLogStatus, StatusTone> = {
  Success: SEVERITY_TONES.success,
  Failed: SEVERITY_TONES.error,
};

/** Dark-mode tints keep the toggle working without inventing a third palette. */
const SEVERITY_TONES_DARK: Record<SystemLogSeverity, StatusTone> = {
  info: { label: "Info", text: "#93C5FD", bg: "rgba(22,119,255,0.16)", dot: "#60A5FA" },
  success: { label: "Success", text: "#86EFAC", bg: "rgba(34,197,94,0.16)", dot: "#34D399" },
  warning: { label: "Warning", text: "#FCD34D", bg: "rgba(245,158,11,0.16)", dot: "#FBBF24" },
  error: { label: "Error", text: "#FCA5A5", bg: "rgba(239,68,68,0.16)", dot: "#FB7185" },
};

const STATUS_TONES_DARK: Record<SystemLogStatus, StatusTone> = {
  Success: SEVERITY_TONES_DARK.success,
  Failed: SEVERITY_TONES_DARK.error,
};

export type SystemLogsPalette = ReturnType<typeof useSystemLogsPalette>;

export function useSystemLogsPalette() {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const base = getAdminDashboardPalette(resolvedTheme);
    const isDark = resolvedTheme === "dark";

    return {
      ...base,
      /** Table header strip and other quiet fills. */
      subtleSurface: isDark ? "#111C33" : "#F5F9FF",
      /** Row hover — one step off the card, never a grey. */
      rowHover: isDark ? "#111C33" : "#F8FBFF",
      /** Selected row / card. `bannerBg` is the dashboard's own blue tint. */
      rowSelected: base.bannerBg,
      /** Icon wells inside detail rows. */
      iconWell: isDark ? "#111C33" : "#EEF3FA",
      severity: isDark ? SEVERITY_TONES_DARK : SEVERITY_TONES,
      status: isDark ? STATUS_TONES_DARK : STATUS_TONES,
      isDark,
    };
  }, [resolvedTheme]);
}

/** Subtle elevation shared by every System Logs surface. */
export const CARD_SHADOW = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.04,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;

/** Radius scale, matching User Management: soft cards, fully rounded pills. */
export const RADIUS = {
  card: 16,
  pill: 9999,
} as const;

export const SUMMARY_CARD_META = {
  totalLogs: { label: "Total Logs", icon: "file-text" as const, tone: "info" as SystemLogSeverity },
  errorsToday: { label: "Errors Today", icon: "alert-circle" as const, tone: "error" as SystemLogSeverity },
  warnings: { label: "Warnings", icon: "alert-triangle" as const, tone: "warning" as SystemLogSeverity },
  successfulActions: { label: "Successful Actions", icon: "check-circle" as const, tone: "success" as SystemLogSeverity },
};
