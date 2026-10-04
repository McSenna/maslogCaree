import { Platform, StyleSheet } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import { webStyle } from "@/theme/webStyle";
import { PALETTE, withAlpha } from "@/theme/palette";

export const AUTH_INPUT_COLORS = {
  border: PALETTE.blue[200],
  borderHover: PALETTE.slate[300],
  surface: PALETTE.slate[50],
  placeholder: PALETTE.slate[500],
  icon: PALETTE.slate[500],
  error: PALETTE.red[600],
  errorSurface: PALETTE.slate[50],
  disabledSurface: PALETTE.slate[100],
  disabledBorder: PALETTE.slate[200],
  disabledText: PALETTE.slate[400],
  label: PALETTE.slate[700],
} as const;

export const FOCUS_RING = `0px 0px 0px 3px ${withAlpha(PALETTE.blue[600], 0.16)}`;

export const ERROR_RING = `0px 0px 0px 3px ${withAlpha(PALETTE.red[600], 0.14)}`;

const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

export const authInputStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: AUTH_INPUT_COLORS.border,
    borderRadius: 13,
    backgroundColor: AUTH_INPUT_COLORS.surface,
    paddingHorizontal: 16,
    gap: 12,
    ...webStyle({
        transition: "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
      }),
  },
  containerHovered: {
    borderColor: AUTH_INPUT_COLORS.borderHover,
  },
  containerFocused: {
    borderColor: LANDING_COLORS.primaryBlue,
    backgroundColor: LANDING_COLORS.white,
    ...webStyle({ boxShadow: FOCUS_RING }),
  },
  containerError: {
    borderColor: AUTH_INPUT_COLORS.error,
    backgroundColor: AUTH_INPUT_COLORS.errorSurface,
  },
  containerErrorFocused: {
    ...webStyle({ boxShadow: ERROR_RING }),
  },
  containerDisabled: {
    backgroundColor: AUTH_INPUT_COLORS.disabledSurface,
    borderColor: AUTH_INPUT_COLORS.disabledBorder,
  },
  leftIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontFamily: FONT_FAMILY,
    color: LANDING_COLORS.navy,
    paddingVertical: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    ...webStyle({
      outlineStyle: "none",
      boxShadow: "none",
      appearance: "none",
    }),
  },
  inputDisabled: {
    color: AUTH_INPUT_COLORS.disabledText,
  },
  eyeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    ...webStyle({
        cursor: "pointer",
        transition: "background-color 160ms ease",
      }),
  },
  eyeButtonActive: {
    backgroundColor: withAlpha(PALETTE.blue[600], 0.10),
  },
});
