import { useMemo } from "react";

import { useTheme } from "@/contexts/ThemeContext";

/**
 * Shared tokens for the resident overlays (medical details, reschedule,
 * cancel) so the same surface, text and accent colours are used whichever
 * wrapper — modal or bottom sheet — the dialog renders in.
 */
export const useResidentDialogPalette = () => {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const isDark = resolvedTheme === "dark";

    return {
      isDark,
      surface: isDark ? "#0F172A" : "#FFFFFF",
      card: isDark ? "#1E293B" : "#F8FAFC",
      cardRaised: isDark ? "#0F172A" : "#FFFFFF",
      border: isDark ? "#334155" : "#E2E8F0",
      divider: isDark ? "#1E293B" : "#F1F5F9",
      heading: isDark ? "#F8FAFC" : "#0F172A",
      body: isDark ? "#CBD5E1" : "#334155",
      muted: isDark ? "#94A3B8" : "#64748B",

      accent: "#0284C7",
      accentSoft: isDark ? "rgba(2,132,199,0.18)" : "rgba(2,132,199,0.10)",
      accentBorder: isDark ? "rgba(2,132,199,0.40)" : "rgba(2,132,199,0.25)",

      danger: "#EF4444",
      dangerFg: isDark ? "#FCA5A5" : "#DC2626",
      dangerSoft: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)",
      dangerBorder: isDark ? "rgba(239,68,68,0.30)" : "#FECACA",

      successSoft: isDark ? "#064E3B" : "#DCFCE7",
      successFg: isDark ? "#A7F3D0" : "#166534",
      successBorder: isDark ? "#059669" : "#86EFAC",

      warning: "#D97706",
      warningSoft: isDark ? "rgba(217,119,6,0.12)" : "rgba(217,119,6,0.08)",
      warningFg: isDark ? "#FCD34D" : "#B45309",

      disabled: isDark ? "#334155" : "#CBD5E1",
    };
  }, [resolvedTheme]);
};

export type ResidentDialogPalette = ReturnType<typeof useResidentDialogPalette>;
