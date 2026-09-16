import type { Feather } from "@expo/vector-icons";
import { Platform, type ViewStyle } from "react-native";

export type ProfileAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ProfileMenuItem = {
  key: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  danger?: boolean;
};

export const MENU_WIDTH = 212;
export const EDGE_MARGIN = 12;
export const ANCHOR_GAP = 8;
export const FALLBACK_TOP = 72;
export const OPEN_MS = 180;
export const CLOSE_MS = 150;

export const LIFT = -6;
export const SHRINK = 0.97;

export const menuShadow = (isDark: boolean): ViewStyle =>
  Platform.select<ViewStyle>({
    web: {
      boxShadow: isDark
        ? "0px 12px 28px rgba(2,6,23,0.55)"
        : "0px 12px 28px rgba(15,37,87,0.12)",
    },
    default: {
      shadowColor: "#0F2557",
      shadowOpacity: isDark ? 0.4 : 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
  }) as ViewStyle;
