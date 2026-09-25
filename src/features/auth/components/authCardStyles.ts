import { Platform, StyleSheet } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import { AUTH_CARD_MAX_WIDTH } from "./authCardMetricPresets";
import { FONT_FAMILY } from "./authCardFont";
import { webStyle } from "@/theme/webStyle";

const BUTTON_BASE = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  borderRadius: 12,
  ...webStyle({
      cursor: "pointer",
      transition: "background-color 180ms ease, box-shadow 180ms ease",
    }),
} as const;

export const authCardStyles = StyleSheet.create({
  card: {
    backgroundColor: LANDING_COLORS.white,
    borderWidth: 1,
    borderColor: "#E2EAF4",
    ...(Platform.OS === "web" ? webStyle({
        boxShadow: "0px 14px 40px rgba(8, 21, 47, 0.08)",
        transition: "box-shadow 220ms ease, border-color 220ms ease",
      }) : {
        elevation: 5,
        shadowColor: "#08152F",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.07,
        shadowRadius: 24,
      }),
  },
  cardHovered: {
    ...webStyle({
        boxShadow: "0px 22px 56px rgba(8, 21, 47, 0.13)",
        borderColor: "#D2E0F2",
      }),
  },
  cardDesktop: {
    width: "100%",
    maxWidth: AUTH_CARD_MAX_WIDTH.default,
  },
  cardDesktopCompact: {
    width: "100%",
    maxWidth: AUTH_CARD_MAX_WIDTH.compact,
  },
  cardMobile: {
    width: "100%",
  },

  form: {
    flexDirection: "column",
  },

  loginButton: {
    ...BUTTON_BASE,
    backgroundColor: LANDING_COLORS.primaryBlue,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loginButtonText: {
    color: LANDING_COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.1,
  },
  buttonHovered: {
    ...webStyle({ boxShadow: "0px 10px 22px rgba(8, 21, 47, 0.18)" }),
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  forgotContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    ...webStyle({
        cursor: "pointer",
        transition: "background-color 160ms ease",
      }),
  },
  forgotContainerActive: {
    backgroundColor: "rgba(8, 102, 245, 0.08)",
  },
  forgotText: {
    color: LANDING_COLORS.primaryBlue,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
  },
  forgotTextActive: {
    textDecorationLine: "underline",
  },

  createButton: {
    ...BUTTON_BASE,
    backgroundColor: LANDING_COLORS.green,
  },
  createButtonText: {
    color: LANDING_COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.1,
  },

  securityWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
