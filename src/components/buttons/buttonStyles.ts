import type { ThemeColors } from "@/theme/colors";
import { PALETTE } from "@/theme/palette";

/**
 * primary: Healthcare Blue fill, the one main action. secondary: neutral
 * outline for the alternative. outline: blue outline for a supporting action
 * that should still read as brand. danger: destructive. ghost and text: low
 * emphasis.
 */
export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost" | "text";

export type ButtonSize = "sm" | "md" | "lg";

type VisualState = { hovered: boolean; pressed: boolean; disabled: boolean };

export type ButtonAppearance = { background: string; border: string; foreground: string };

export const BUTTON_HEIGHT: Record<ButtonSize, number> = { sm: 36, md: 44, lg: 52 };

export const BUTTON_PADDING_X: Record<ButtonSize, number> = { sm: 12, md: 16, lg: 20 };

export const BUTTON_FONT: Record<ButtonSize, number> = { sm: 13, md: 14, lg: 15 };

export const BUTTON_ICON: Record<ButtonSize, number> = { sm: 15, md: 16, lg: 18 };

const TRANSPARENT = "transparent";

export const resolveButtonAppearance = (
  variant: ButtonVariant,
  colors: ThemeColors,
  { hovered, pressed, disabled }: VisualState
): ButtonAppearance => {
  const active = !disabled;
  const isLink = variant === "ghost" || variant === "text";

  // Every variant greys out the same way, so "not available" reads the same
  // everywhere instead of as a faded version of each colour.
  if (disabled) {
    return isLink
      ? { background: TRANSPARENT, border: TRANSPARENT, foreground: colors.subtle }
      : { background: colors.surfaceMuted, border: colors.border, foreground: colors.subtle };
  }

  switch (variant) {
    case "primary": {
      const background =
        active && pressed ? colors.primaryPressed : active && hovered ? colors.primaryHover : colors.primary;
      return { background, border: background, foreground: colors.onPrimary };
    }
    case "danger": {
      const base = colors.scheme === "dark" ? PALETTE.red[300] : PALETTE.red[600];
      const hover = colors.scheme === "dark" ? PALETTE.red[200] : PALETTE.red[700];
      const background = active && (hovered || pressed) ? hover : base;
      return { background, border: background, foreground: colors.scheme === "dark" ? PALETTE.slate[950] : PALETTE.white };
    }
    case "secondary":
      return {
        background: active && (hovered || pressed) ? colors.surfaceHover : colors.surface,
        border: active && (hovered || pressed) ? colors.primary : colors.borderStrong,
        foreground: colors.heading,
      };
    case "outline":
      return {
        background: active && (hovered || pressed) ? colors.primarySoft : colors.surface,
        border: colors.primary,
        foreground: colors.primary,
      };
    case "ghost":
      return {
        background: active && (hovered || pressed) ? colors.primarySoft : TRANSPARENT,
        border: TRANSPARENT,
        foreground: colors.primary,
      };
    case "text":
      return { background: TRANSPARENT, border: TRANSPARENT, foreground: colors.primary };
  }
};
