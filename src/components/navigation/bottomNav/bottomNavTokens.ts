import type { StoredTheme } from "@/utils/storage";

export type BottomNavPalette = {
  surface: string;
  border: string;
  active: string;
  activePill: string;
  inactive: string;
  shadow: string;
  badgeBg: string;
  badgeText: string;
};

const LIGHT: BottomNavPalette = {
  surface: "#FFFFFF",
  border: "#E2E8F0",
  active: "#2563EB",
  activePill: "#EFF6FF",
  inactive: "#64748B",
  shadow: "0px -2px 14px rgba(15, 23, 42, 0.06)",
  badgeBg: "#EF4444",
  badgeText: "#FFFFFF",
};

const DARK: BottomNavPalette = {
  surface: "#0F172A",
  border: "rgba(51, 65, 85, 0.7)",
  active: "#60A5FA",
  activePill: "rgba(96, 165, 250, 0.16)",
  inactive: "#94A3B8",
  shadow: "0px -2px 18px rgba(0, 0, 0, 0.45)",
  badgeBg: "#EF4444",
  badgeText: "#FFFFFF",
};

export const getBottomNavPalette = (theme: StoredTheme): BottomNavPalette => {
  return theme === "dark" ? DARK : LIGHT;
};

export const BOTTOM_NAV_METRICS = {
  radius: 16,
  touchTarget: 44,
  iconSize: 20,
  iconBox: 22,
  pillHeight: 28,
  pillMinWidth: 52,
  pillRadius: 14,
  paddingHorizontal: 8,
  labelSize: 11,
  labelSizeCompact: 10,
} as const;

export const BOTTOM_NAV_TIMING = {
  active: 180,
} as const;
