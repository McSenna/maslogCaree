import type { StoredTheme } from "@/utils/storage";

/**
 * Visual language for the MaslogCare bottom navigation.
 *
 * Kept in one place so the bar, its items and the badge never drift apart,
 * and so the healthcare palette (white surface, primary blue state, slate
 * muted text) is declared once instead of being retyped per component.
 */
export type BottomNavPalette = {
  /** Bar background */
  surface: string;
  /** Hairline top border separating the bar from page content */
  border: string;
  /** Active icon + label */
  active: string;
  /** Soft pill sitting behind the active icon */
  activePill: string;
  /** Inactive icon + label */
  inactive: string;
  /** Upward shadow under the bar */
  shadow: string;
  /** Unread badge */
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

export function getBottomNavPalette(theme: StoredTheme): BottomNavPalette {
  return theme === "dark" ? DARK : LIGHT;
}

/**
 * Fixed measurements. Sizes stay constant across phone widths (360 → 430) —
 * the tabs flex, the glyphs do not, which is what keeps the bar balanced.
 *
 * The bar is icon-only; each tab's label survives as its screen-reader name.
 */
export const BOTTOM_NAV_METRICS = {
  /** Rounded top corners so the bar reads as a surface, not a cut-off edge */
  radius: 16,
  /** Minimum touch target per tab (Android/iOS accessibility guidance) */
  touchTarget: 44,
  iconSize: 20,
  /** Square the icon is centred in — the badge anchors to this, not the pill */
  iconBox: 22,
  pillHeight: 28,
  pillMinWidth: 52,
  pillRadius: 14,
  /** Horizontal breathing room inside the bar */
  paddingHorizontal: 8,
} as const;

/** Active/press transition timing — quick enough to feel instant, not flashy. */
export const BOTTOM_NAV_TIMING = {
  active: 180,
  press: 110,
} as const;
