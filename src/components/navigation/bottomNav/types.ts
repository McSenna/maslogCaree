import type { Feather } from "@expo/vector-icons";

export type BottomNavEntry = {
  label: string;
  shortLabel?: string;
  href: string;
  icon: keyof typeof Feather.glyphMap;
  badgeCount?: number;
  accessibilityLabel?: string;
};
