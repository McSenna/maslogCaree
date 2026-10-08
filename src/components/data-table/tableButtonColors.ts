import type { ThemeColors } from "@/theme/colors";

export type TableButtonVariant = "outlined" | "text" | "primary";
export type TableButtonTone = "default" | "danger";

type ButtonColors = { foreground: string; background: string; border: string };

const TRANSPARENT = "transparent";

/** Resting and hovered colours for each button variant, all from theme tokens. */
export const tableButtonColors = (
  colors: ThemeColors,
  variant: TableButtonVariant,
  tone: TableButtonTone,
  active: boolean
): ButtonColors => {
  const danger = tone === "danger";

  if (variant === "primary") {
    return {
      foreground: colors.onPrimary,
      background: active ? colors.primaryHover : colors.primary,
      border: TRANSPARENT,
    };
  }

  if (variant === "text") {
    const hover = danger ? colors.danger.fg : colors.primary;
    return {
      foreground: active ? hover : colors.heading,
      background: TRANSPARENT,
      border: TRANSPARENT,
    };
  }

  const accent = danger ? colors.danger.fg : colors.primary;
  return {
    foreground: accent,
    background: active ? (danger ? colors.danger.bg : colors.primarySoft) : colors.surface,
    border: active ? accent : colors.border,
  };
};
