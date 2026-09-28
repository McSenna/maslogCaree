import { useTheme } from "@/contexts/ThemeContext";
import { PALETTE } from "@/theme/palette";

export const useChartPalette = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return {
    isDark,
    gridColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.055)",
    axisColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.09)",
    tickColor: isDark ? "#7D8CA3" : PALETTE.slate[500],
    crosshairColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.14)",
    surface: isDark ? "#1A1A2E" : "#FFFFFF",
    tooltipBg: isDark ? "#1E293B" : "#0F2557",
    tooltipBorder: isDark ? "rgba(255,255,255,0.12)" : "transparent",
  };
};
