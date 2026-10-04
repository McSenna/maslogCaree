import type { Breakpoint } from "@/theme/breakpoints";
import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { PALETTE, withAlpha } from "@/theme/palette";

const SIDEBAR_WIDTHS: Record<Breakpoint, number> = { mobile: 0, tablet: 224, desktop: 256, wide: 272 };

export const getSidebarWidth = (breakpoint: Breakpoint): number => SIDEBAR_WIDTHS[breakpoint];

export const SIDEBAR_METRICS = {
  paddingX: 20,
  itemHeight: 48,
  // 10px, not half the item height: a fully rounded nav item reads as a pill button.
  itemRadius: 10,
  itemPaddingX: 16,
  itemGap: 10,
  iconSize: 20,
  iconGap: 14,
  sealSize: 89,
} as const;

const { blue, green, slate, night } = PALETTE;

/**
 * Sidebar colours for every role. The active item is Healthcare Blue text and
 * icon on a faint blue wash: clear, but never a heavy block. The MaslogCare
 * wordmark keeps Dark Navy plus brand blue.
 */
export const useSidebarPalette = () => {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const isDark = resolvedTheme === "dark";

    if (isDark) {
      return {
        isDark,
        surface: night.surface,
        border: night.line,
        eyebrow: night.subtle,
        heading: night.heading,
        idle: night.muted,
        active: blue[300],
        activeBg: withAlpha(blue[600], 0.16),
        hoverBg: withAlpha(slate[400], 0.1),
        decorLine: withAlpha(blue[600], 0.32),
        decorSoft: withAlpha(blue[600], 0.18),
        wave: withAlpha(blue[600], 0.12),
        waveSoft: withAlpha(blue[600], 0.06),
        community: night.muted,
        leaf: green[400],
        brandNavy: night.heading,
        brandBlue: blue[400],
        tagline: night.subtle,
      };
    }

    return {
      isDark,
      surface: PALETTE.white,
      border: slate[200],
      eyebrow: slate[500],
      heading: PALETTE.ink,
      idle: slate[600],
      active: blue[600],
      activeBg: blue[50],
      hoverBg: slate[50],
      decorLine: blue[200],
      decorSoft: blue[100],
      wave: blue[50],
      waveSoft: slate[50],
      community: slate[600],
      leaf: green[500],
      brandNavy: PALETTE.ink,
      brandBlue: blue[600],
      tagline: slate[500],
    };
  }, [resolvedTheme]);
};

export type SidebarPalette = ReturnType<typeof useSidebarPalette>;
