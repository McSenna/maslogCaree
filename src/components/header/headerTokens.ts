import { Platform } from "react-native";
import { PALETTE, withAlpha } from "@/theme/palette";

export type HeaderPalette = {
  background: string;
  border: string;
  divider: string;
  brand: string;
  title: string;
  muted: string;
  icon: string;
  avatarRing: string;
  avatarFallbackBg: string;
  avatarFallbackIcon: string;
  menuBg: string;
  menuBorder: string;
  menuHover: string;
  danger: string;
};

const { blue, slate, red, night } = PALETTE;

export const HEADER_COLORS: Record<"light" | "dark", HeaderPalette> = {
  light: {
    background: PALETTE.white,
    border: slate[200],
    divider: slate[200],
    brand: blue[600],
    title: PALETTE.ink,
    muted: slate[500],
    icon: slate[600],
    avatarRing: slate[200],
    avatarFallbackBg: blue[50],
    avatarFallbackIcon: blue[600],
    menuBg: PALETTE.white,
    menuBorder: slate[200],
    menuHover: blue[50],
    danger: red[600],
  },
  dark: {
    background: night.surface,
    border: night.line,
    divider: night.line,
    brand: blue[400],
    title: night.heading,
    muted: night.muted,
    icon: night.body,
    avatarRing: night.lineStrong,
    avatarFallbackBg: night.raised,
    avatarFallbackIcon: blue[300],
    menuBg: night.raised,
    menuBorder: night.lineStrong,
    menuHover: withAlpha(blue[600], 0.16),
    danger: red[300],
  },
};

export const NOTIFICATION_DOT = red[500];

export const HEADER_HEIGHT = {
  mobile: 60,
  desktop: 76,
} as const;

export const IDENTITY_MIN_WIDTH = 900;

export const HEADER_FONT = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

export const getHeaderPalette = (isDark: boolean): HeaderPalette => HEADER_COLORS[isDark ? "dark" : "light"];
