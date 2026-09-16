import { Platform, StyleSheet } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";

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
    borderWidth: 1,
    borderColor: "#D9E3EF",
    borderRadius: 13,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    gap: 12,
  },
  containerFocused: {
    borderColor: LANDING_COLORS.primaryBlue,
    borderWidth: 1.8,
    backgroundColor: LANDING_COLORS.white,
  },
  leftIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontFamily: FONT_FAMILY,
    color: LANDING_COLORS.navy,
    paddingVertical: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    ...Platform.select({
      web: {
        outlineStyle: "none",
        boxShadow: "none",
        appearance: "none",
      } as any,
    }),
  },
  eyeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    ...Platform.select({
      web: {
        cursor: "pointer",
      } as any,
    }),
  },
});
