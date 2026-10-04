import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette, type StatusTone as SharedStatusTone } from "@/design/adminDashboardTheme";
import type { SystemLogSeverity, SystemLogStatus } from "@/features/systemLogs/services/systemLogService";
import { createShadow } from "@/design/shadow";
import { PALETTE } from "@/theme/palette";

export type StatusTone = {
  label: string;
  text: string;
  bg: string;
  dot: string;
};

const logBadge = (label: string, tone: SharedStatusTone): StatusTone => ({
  label,
  text: tone.fg,
  bg: tone.bg,
  dot: tone.fg,
});

export type SystemLogsPalette = ReturnType<typeof useSystemLogsPalette>;

export const useSystemLogsPalette = () => {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const base = getAdminDashboardPalette(resolvedTheme);
    const isDark = resolvedTheme === "dark";

    const { statusTones } = base;
    const severity: Record<SystemLogSeverity, StatusTone> = {
      info: logBadge("Info", statusTones.info),
      success: logBadge("Success", statusTones.success),
      warning: logBadge("Warning", statusTones.warning),
      error: logBadge("Error", statusTones.danger),
    };

    return {
      ...base,
      subtleSurface: isDark ? PALETTE.night.raised : PALETTE.slate[50],
      rowHover: base.hoverBg,
      rowSelected: base.bannerBg,
      iconWell: isDark ? PALETTE.night.raised : PALETTE.slate[100],
      severity,
      status: { Success: severity.success, Failed: severity.error } satisfies Record<SystemLogStatus, StatusTone>,
      isDark,
    };
  }, [resolvedTheme]);
};

export const CARD_SHADOW = createShadow({
  color: PALETTE.ink,
  opacity: 0.04,
  radius: 12,
  offsetY: 2,
  elevation: 1,
});

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
