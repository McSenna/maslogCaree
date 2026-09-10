import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";

/**
 * The palette every admin table surface draws from.
 *
 * User Management, Inventory and System Logs each layer their own row tones on
 * top of this, but the card, border, menu and control colours are the same on
 * all three — and the shared toolbar primitives (search, select, checkbox,
 * pagination) need exactly this much and nothing feature-specific, which is
 * what lets them live in the shared UI folder rather than inside one feature.
 */
export function useAdminSurfacePalette() {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const base = getAdminDashboardPalette(resolvedTheme);
    const isDark = resolvedTheme === "dark";

    return {
      ...base,
      /** Table header strip and other quiet fills. */
      subtleSurface: isDark ? "#111C33" : "#F8FBFF",
      /** Selected / hovered row — one step off the card, never a grey. */
      rowSelected: base.bannerBg,
      /** Unchecked checkbox and other hairline controls. */
      controlBorder: isDark ? "#334155" : "#CBD5E1",
      isDark,
    };
  }, [resolvedTheme]);
}

export type AdminSurfacePalette = ReturnType<typeof useAdminSurfacePalette>;
