import { useTheme } from "@/contexts/ThemeContext";
import { PALETTE, withAlpha } from "@/theme/palette";

export const useChartPalette = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return {
    isDark,
    gridColor: isDark ? withAlpha(PALETTE.white, 0.07) : withAlpha(PALETTE.slate[800], 0.055),
    axisColor: isDark ? withAlpha(PALETTE.white, 0.12) : withAlpha(PALETTE.slate[800], 0.09),
    tickColor: isDark ? PALETTE.slate[400] : PALETTE.slate[500],
    crosshairColor: isDark ? withAlpha(PALETTE.white, 0.18) : withAlpha(PALETTE.slate[800], 0.14),
    // Chart surfaces match the console card so point rings blend into it.
    surface: isDark ? PALETTE.slate[900] : PALETTE.white,
    tooltipBg: isDark ? PALETTE.slate[800] : PALETTE.slate[800],
    tooltipBorder: isDark ? withAlpha(PALETTE.white, 0.12) : "transparent",
  };
};
