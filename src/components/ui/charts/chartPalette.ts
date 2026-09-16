import { useTheme } from "@/contexts/ThemeContext";

export const useChartPalette = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return {
    isDark,
    gridColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.055)",
    axisColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.09)",
    tickColor: isDark ? "rgba(255,255,255,0.38)" : "#94A3B8",
    crosshairColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.14)",
    surface: isDark ? "#1A1A2E" : "#FFFFFF",
    tooltipBg: isDark ? "#1E293B" : "#0F2557",
    tooltipBorder: isDark ? "rgba(255,255,255,0.12)" : "transparent",
  };
};
