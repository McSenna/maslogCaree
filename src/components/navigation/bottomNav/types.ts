import type { Feather } from "@expo/vector-icons";

/**
 * One destination in the bottom bar.
 *
 * Structurally compatible with the existing `NavItem` used by the sidebar and
 * `roleNavConfig`, so role configs can be passed straight through; the extra
 * fields are optional.
 */
export type BottomNavEntry = {
  label: string;
  href: string;
  /** Feather only — one icon family across the whole bar. */
  icon: keyof typeof Feather.glyphMap;
  /** Unread count rendered as a badge on the icon. */
  badgeCount?: number;
  /** Overrides the default "<label> tab" screen-reader label. */
  accessibilityLabel?: string;
};
