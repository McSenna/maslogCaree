import type { ViewStyle } from "react-native";

import type { ThemeColors } from "@/theme/colors";
import { TIMING } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { webStyle } from "@/theme/webStyle";

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

type FieldAppearance = ReturnType<typeof resolveFieldAppearance>;

/** The bordered box around a text input. A trailing button (show/hide) brings its own padding. */
export const fieldBoxStyle = (
  look: FieldAppearance,
  options: { minHeight: number; multiline: boolean; trailingButton: boolean; disabled: boolean }
): ViewStyle[] => [
  {
    minHeight: options.minHeight,
    flexDirection: "row",
    alignItems: options.multiline ? "flex-start" : "center",
    gap: 10,
    paddingLeft: 14,
    paddingRight: options.trailingButton ? 4 : 14,
    borderRadius: RADII.medium,
    borderWidth: look.borderWidth,
    borderColor: look.border,
    backgroundColor: look.background,
    opacity: options.disabled ? 0.7 : 1,
  },
  webStyle({
    transition: `border-color ${TIMING.hover}ms ease, box-shadow ${TIMING.hover}ms ease`,
    boxShadow: look.ring ? `0 0 0 3px ${look.ring}` : "none",
  }),
];
