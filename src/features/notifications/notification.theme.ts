import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export type NotificationPalette = {
  background: string;
  surface: string;
  unreadSurface: string;
  unreadDot: string;
  pressed: string;
  border: string;
  divider: string;
  heading: string;
  body: string;
  muted: string;
  subtle: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  teal: string;
  tealSoft: string;
  scrim: string;
};

/** Light values come straight from the shared MaslogCare profile palette. */
export const LIGHT_NOTIFICATION_PALETTE: NotificationPalette = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  unreadSurface: "rgba(37,99,235,0.035)",
  unreadDot: "#2563EB",
  pressed: "rgba(15,23,42,0.04)",
  border: "#E2E8F0",
  divider: "#F1F5F9",
  heading: "#0F2557",
  body: "#334155",
  muted: "#64748B",
  subtle: "#94A3B8",
  primary: "#1677FF",
  primarySoft: "#EBF3FF",
  onPrimary: "#FFFFFF",
  success: "#16A34A",
  successSoft: "#DCFCE7",
  warning: "#D97706",
  warningSoft: "#FEF3C7",
  danger: "#DC2626",
  dangerSoft: "#FEE2E2",
  teal: "#0D9488",
  tealSoft: "#CCFBF1",
  scrim: "rgba(15,23,42,0.18)",
};

/** Dark values mirror the shared dashboard dark palette. */
export const DARK_NOTIFICATION_PALETTE: NotificationPalette = {
  background: "#020617",
  surface: "#0F172A",
  unreadSurface: "rgba(96,165,250,0.08)",
  unreadDot: "#60A5FA",
  pressed: "#1E293B",
  border: "#1E293B",
  divider: "#1E293B",
  heading: "#F8FAFC",
  body: "#CBD5E1",
  muted: "#94A3B8",
  subtle: "#64748B",
  primary: "#60A5FA",
  primarySoft: "rgba(96,165,250,0.16)",
  onPrimary: "#0B1120",
  success: "#34D399",
  successSoft: "rgba(52,211,153,0.16)",
  warning: "#FBBF24",
  warningSoft: "rgba(251,191,36,0.16)",
  danger: "#FB7185",
  dangerSoft: "rgba(251,113,133,0.16)",
  teal: "#22D3EE",
  tealSoft: "rgba(34,211,238,0.16)",
  scrim: "rgba(2,6,23,0.45)",
};

export const getNotificationPalette = (isDark: boolean): NotificationPalette =>
  isDark ? DARK_NOTIFICATION_PALETTE : LIGHT_NOTIFICATION_PALETTE;

export const useNotificationPalette = (): NotificationPalette => {
  const { resolvedTheme } = useTheme();
  return useMemo(() => getNotificationPalette(resolvedTheme === "dark"), [resolvedTheme]);
};

export const NOTIFICATION_RADIUS = {
  control: 12,
  panel: 18,
  icon: 12,
  pill: 9999,
} as const;

export const NOTIFICATION_METRICS = {
  iconSize: 42,
  compactIconSize: 36,
  rowGap: 12,
  rowPaddingY: 14,
  rowPaddingX: 16,
  compactRowPaddingY: 11,
  compactRowPaddingX: 14,
  titleDescGap: 4,
  descTimeGap: 6,
  panelMinWidth: 380,
  panelMaxWidth: 440,
  panelMaxHeight: 560,
  pageMaxWidth: 760,
} as const;
