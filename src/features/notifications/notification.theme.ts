import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette, type AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { PALETTE, withAlpha } from "@/theme/palette";

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
  care: string;
  careSoft: string;
  scrim: string;
};

// Built from the shared palette so notifications use the same text, surface
// and status roles as every other page. Status colours are the tone
// foregrounds and tints; "care" (Healthcare Green) marks medical updates.
const fromPalette = (base: AdminDashboardPalette, isDark: boolean): NotificationPalette => ({
  background: base.pageBg,
  surface: base.cardBg,
  unreadSurface: withAlpha(PALETTE.blue[600], isDark ? 0.1 : 0.04),
  unreadDot: base.primary,
  pressed: base.hoverBg,
  border: base.cardBorder,
  divider: base.divider,
  heading: base.heading,
  body: base.body,
  muted: base.muted,
  subtle: base.subtle,
  primary: base.primary,
  primarySoft: base.tones.primary.iconBg,
  onPrimary: base.onPrimary,
  success: base.statusTones.success.fg,
  successSoft: base.statusTones.success.bg,
  warning: base.statusTones.warning.fg,
  warningSoft: base.statusTones.warning.bg,
  danger: base.statusTones.danger.fg,
  dangerSoft: base.statusTones.danger.bg,
  care: base.tones.care.icon,
  careSoft: base.tones.care.iconBg,
  scrim: isDark ? withAlpha(PALETTE.night.page, 0.6) : withAlpha(PALETTE.ink, 0.28),
});

export const LIGHT_NOTIFICATION_PALETTE = fromPalette(getAdminDashboardPalette("light"), false);
export const DARK_NOTIFICATION_PALETTE = fromPalette(getAdminDashboardPalette("dark"), true);

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
} as const;
