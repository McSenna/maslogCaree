import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

/**
 * - danger: the secondary shape with destructive colours (Deactivate, Delete).
 * - ghost: no border or fill until hovered, for icon buttons inside rows and bars.
 */
export type DashboardButtonVariant = "primary" | "secondary" | "link" | "danger" | "ghost";

type ButtonColors = { foreground: string; background: string; border: string | null };

/** Colours for one variant, at rest or hovered/pressed. `border` null means no border. */
export const dashboardButtonColors = (
  palette: AdminDashboardPalette,
  variant: DashboardButtonVariant,
  active: boolean
): ButtonColors => {
  switch (variant) {
    case "primary":
      return { foreground: palette.onPrimary, background: palette.primary, border: null };
    case "link":
      return { foreground: palette.primary, background: active ? palette.tones.primary.cardBg : "transparent", border: null };
    case "danger": {
      const danger = palette.statusTones.danger;
      return { foreground: danger.fg, background: active ? danger.bg : palette.cardBg, border: danger.border };
    }
    case "ghost":
      return { foreground: palette.body, background: active ? palette.hoverBg : "transparent", border: null };
    default:
      return { foreground: palette.primary, background: active ? palette.hoverBg : palette.cardBg, border: palette.cardBorder };
  }
};
