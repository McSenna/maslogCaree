import { Platform } from "react-native";

/**
 * Header design tokens.
 *
 * Values come from the approved MaslogCare header reference: a white bar with
 * blue branding on the left and the notification/profile cluster on the right.
 * Dark values keep the same proportions for the app's dark theme.
 */
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

export const HEADER_COLORS: Record<"light" | "dark", HeaderPalette> = {
  light: {
    background: "#FFFFFF",
    border: "#E8EEF5",
    divider: "#E5EAF2",
    brand: "#1677FF",
    title: "#0F2557",
    muted: "#64748B",
    icon: "#0F2557",
    avatarRing: "#E5EAF2",
    avatarFallbackBg: "#E7F1FF",
    avatarFallbackIcon: "#1677FF",
    menuBg: "#FFFFFF",
    menuBorder: "#E5EAF2",
    menuHover: "#F1F6FD",
    danger: "#E11D48",
  },
  dark: {
    background: "#0F172A",
    border: "rgba(148,163,184,0.18)",
    divider: "rgba(148,163,184,0.28)",
    brand: "#60A5FA",
    title: "#E2E8F0",
    muted: "#94A3B8",
    icon: "#E2E8F0",
    avatarRing: "rgba(148,163,184,0.35)",
    avatarFallbackBg: "#1E293B",
    avatarFallbackIcon: "#93C5FD",
    menuBg: "#111C33",
    menuBorder: "rgba(148,163,184,0.22)",
    menuHover: "rgba(148,163,184,0.12)",
    danger: "#FB7185",
  },
};

/** Bright red unread indicator — identical in both themes. */
export const NOTIFICATION_DOT = "#EF3340";

/**
 * Minimum bar height, excluding the status-bar inset: compact on phones,
 * roomier from tablet up. The row grows past this only if its content needs
 * the space.
 */
export const HEADER_HEIGHT = {
  mobile: 60,
  desktop: 76,
} as const;

/**
 * Identity (name + role) needs real estate; below this width the profile
 * collapses to the avatar only so nothing wraps or clips.
 */
export const IDENTITY_MIN_WIDTH = 900;

export const HEADER_FONT = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

export const getHeaderPalette = (isDark: boolean): HeaderPalette =>
  isDark ? HEADER_COLORS.dark : HEADER_COLORS.light;
