import type { ThemeColors } from "@/theme/colors";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "text";

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

  switch (variant) {
    case "primary": {
      const background =
        active && pressed ? colors.primaryPressed : active && hovered ? colors.primaryHover : colors.primary;
      return { background, border: background, foreground: colors.onPrimary };
    }
    case "danger": {
      const base = colors.scheme === "dark" ? "#F87171" : "#DC2626";
      const hover = colors.scheme === "dark" ? "#FCA5A5" : "#B91C1C";
      const background = active && (hovered || pressed) ? hover : base;
      return { background, border: background, foreground: colors.scheme === "dark" ? "#1F0A0A" : "#FFFFFF" };
    }
    case "secondary":
      return {
        background: active && (hovered || pressed) ? colors.surfaceHover : colors.surface,
        border: active && (hovered || pressed) ? colors.primary : colors.borderStrong,
        foreground: colors.heading,
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
