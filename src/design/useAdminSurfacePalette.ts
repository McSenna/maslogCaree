import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import { PALETTE } from "@/theme/palette";

/** The shared surface palette every role's pages read (one palette since 2026-10-02). */
export const useAdminSurfacePalette = () => {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const base = getAdminDashboardPalette(resolvedTheme);
    const isDark = resolvedTheme === "dark";

    return {
      ...base,
      subtleSurface: isDark ? PALETTE.night.raised : PALETTE.slate[50],
      controlBorder: isDark ? PALETTE.night.control : PALETTE.controlLine,
      rowSelected: base.bannerBg,
      isDark,
    };
  }, [resolvedTheme]);
};

export type AdminSurfacePalette = ReturnType<typeof useAdminSurfacePalette>;
