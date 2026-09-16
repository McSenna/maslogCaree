import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";

export const useAdminSurfacePalette = () => {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const base = getAdminDashboardPalette(resolvedTheme);
    const isDark = resolvedTheme === "dark";

    return {
      ...base,
      subtleSurface: isDark ? "#111C33" : "#F8FBFF",
      rowSelected: base.bannerBg,
      controlBorder: isDark ? "#334155" : "#CBD5E1",
      isDark,
    };
  }, [resolvedTheme]);
};

export type AdminSurfacePalette = ReturnType<typeof useAdminSurfacePalette>;
