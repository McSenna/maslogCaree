import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export const SIDEBAR_WIDTH = 288;

export const SIDEBAR_METRICS = {
  paddingX: 20,
  itemHeight: 48,
  itemRadius: 24,
  itemPaddingX: 16,
  itemGap: 10,
  iconSize: 22,
  iconGap: 14,
  sealSize: 89,
} as const;

export const useSidebarPalette = () => {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const isDark = resolvedTheme === "dark";

    return {
      isDark,
      surface: isDark ? "#0F172A" : "#FFFFFF",
      border: isDark ? "#1E293B" : "#E4EAF2",
      eyebrow: isDark ? "#7C8DA6" : "#7387A8",
      heading: isDark ? "#F8FAFC" : "#0F2756",
      idle: isDark ? "#94A3B8" : "#50658A",
      active: isDark ? "#93C5FD" : "#1683F8",
      activeBg: isDark ? "rgba(37,99,235,0.16)" : "#EAF4FF",
      hoverBg: isDark ? "rgba(148,163,184,0.10)" : "#F5F9FF",
      decorLine: isDark ? "#2B4A6F" : "#A8D3FF",
      decorSoft: isDark ? "#1E3A5F" : "#CBE5FF",
      wave: isDark ? "#16304D" : "#DCEBFB",
      waveSoft: isDark ? "#111F35" : "#EFF6FE",
      community: isDark ? "#94A3B8" : "#41618F",
      leaf: isDark ? "#4ADE80" : "#22A45D",
      brandNavy: isDark ? "#E2E8F0" : "#102A56",
      brandBlue: isDark ? "#60A5FA" : "#1683F8",
      tagline: isDark ? "#64748B" : "#8A9BB4",
    };
  }, [resolvedTheme]);
};

export type SidebarPalette = ReturnType<typeof useSidebarPalette>;
