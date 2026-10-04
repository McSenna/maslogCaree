import type { StoredTheme } from "@/utils/storage";
import { PALETTE, withAlpha } from "@/theme/palette";

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
  surface: PALETTE.white,
  border: PALETTE.slate[200],
  active: PALETTE.blue[600],
  activePill: PALETTE.blue[50],
  inactive: PALETTE.slate[500],
  shadow: `0px -2px 14px ${withAlpha(PALETTE.ink, 0.06)}`,
  badgeBg: PALETTE.red[600],
  badgeText: PALETTE.white,
};

const DARK: BottomNavPalette = {
  surface: PALETTE.slate[800],
  border: withAlpha(PALETTE.slate[700], 0.7),
  active: PALETTE.blue[400],
  activePill: withAlpha(PALETTE.blue[400], 0.16),
  inactive: PALETTE.slate[400],
  shadow: `0px -2px 18px ${withAlpha(PALETTE.ink, 0.45)}`,
  badgeBg: PALETTE.red[600],
  badgeText: PALETTE.white,
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
