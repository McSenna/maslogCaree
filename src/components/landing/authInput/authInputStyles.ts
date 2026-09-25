import { Platform, StyleSheet } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import { webStyle } from "@/theme/webStyle";

export const AUTH_INPUT_COLORS = {
  border: "#D9E3EF",
  borderHover: "#B9CBE4",
  surface: "#F8FAFC",
  placeholder: "#8A9BA8",
  icon: "#64748B",
  error: "#DC2626",
  errorSurface: "#FEF7F7",
  disabledSurface: "#F1F5F9",
  disabledBorder: "#E2E8F0",
  disabledText: "#94A3B8",
  label: "#334155",
} as const;

export const FOCUS_RING = "0px 0px 0px 3px rgba(8, 102, 245, 0.16)";

export const ERROR_RING = "0px 0px 0px 3px rgba(220, 38, 38, 0.14)";

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
    backgroundColor: "rgba(8, 102, 245, 0.10)",
  },
});
