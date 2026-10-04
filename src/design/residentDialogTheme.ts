import { useMemo } from "react";

import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import { PALETTE, withAlpha } from "@/theme/palette";

/**
 * Shared tokens for the resident overlays (medical details, reschedule,
 * cancel) so the same surface, text and accent colours are used whichever
 * wrapper: modal or bottom sheet: the dialog renders in.
 */
export const residentDialogPalette = (isDark: boolean) => {
  const base = getAdminDashboardPalette(isDark ? "dark" : "light");
  const { success, danger, warning } = base.statusTones;

  return {
    isDark,
    surface: base.cardBg,
    card: isDark ? PALETTE.night.raised : PALETTE.slate[50],
    cardRaised: isDark ? PALETTE.night.raised : PALETTE.white,
    border: base.cardBorder,
    divider: base.divider,
    heading: base.heading,
    body: base.body,
    muted: base.muted,
    accent: base.primary,
    onAccent: base.onPrimary,
    accentSoft: base.tones.primary.iconBg,
    accentBorder: isDark ? withAlpha(PALETTE.blue[600], 0.4) : PALETTE.blue[200],
    // Icons and outlines; text uses the matching *Fg value.
    danger: isDark ? PALETTE.red[300] : PALETTE.red[600],
    dangerFg: danger.fg,
    dangerSoft: danger.bg,
    dangerBorder: danger.border,
    successSoft: success.bg,
    successFg: success.fg,
    successBorder: success.border,
    warning: isDark ? PALETTE.amber[300] : PALETTE.amber[600],
    warningSoft: warning.bg,
    warningFg: warning.fg,
    disabled: isDark ? PALETTE.night.lineStrong : PALETTE.slate[300],
  };
};

export const useResidentDialogPalette = () => {
  const { resolvedTheme } = useTheme();
  return useMemo(() => residentDialogPalette(resolvedTheme === "dark"), [resolvedTheme]);
};

export type ResidentDialogPalette = ReturnType<typeof residentDialogPalette>;
