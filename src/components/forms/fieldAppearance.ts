import type { ThemeColors } from "@/theme/colors";

export type FieldVisualState = {
  focused: boolean;
  hovered: boolean;
  error: boolean;
  success: boolean;
  disabled: boolean;
};

export const resolveFieldAppearance = (colors: ThemeColors, state: FieldVisualState) => {
  // At rest the outline is borderStrong, not the card border: a field has to
  // be findable (3:1), a card only separated.
  const border = state.error
    ? colors.errorLine
    : state.focused
      ? colors.primary
      : state.success
        ? colors.successLine
        : state.hovered
          ? colors.subtle
          : colors.borderStrong;

  return {
    border,
    borderWidth: state.focused || state.error ? 1.5 : 1,
    background: state.disabled ? colors.surfaceMuted : colors.surface,
    icon: state.error ? colors.danger.fg : state.focused ? colors.primary : colors.subtle,
    ring: state.focused ? (state.error ? colors.danger.border : colors.focusRing) : null,
  };
};
