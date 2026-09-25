import type { ThemeColors } from "@/theme/colors";

export type FieldVisualState = {
  focused: boolean;
  hovered: boolean;
  error: boolean;
  success: boolean;
  disabled: boolean;
};

export const resolveFieldAppearance = (colors: ThemeColors, state: FieldVisualState) => {
  const border = state.error
    ? colors.danger.fg
    : state.focused
      ? colors.primary
      : state.success
        ? colors.success.fg
        : state.hovered
          ? colors.borderStrong
          : colors.border;

  return {
    border,
    borderWidth: state.focused || state.error ? 1.5 : 1,
    background: state.disabled ? colors.surfaceMuted : colors.surface,
    icon: state.error ? colors.danger.fg : state.focused ? colors.primary : colors.muted,
    ring: state.focused ? (state.error ? colors.danger.border : colors.focusRing) : null,
  };
};
