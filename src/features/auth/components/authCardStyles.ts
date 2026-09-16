import { Platform, StyleSheet } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import { AUTH_CARD_MAX_WIDTH } from "./authCardMetricPresets";
import { FONT_FAMILY } from "./authCardFont";

const BUTTON_BASE = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  borderRadius: 12,
  ...Platform.select({
    web: {
      cursor: "pointer",
      transition: "background-color 180ms ease, box-shadow 180ms ease",
    } as any,
  }),
} as const;

export const authCardStyles = StyleSheet.create({
  card: {
    backgroundColor: LANDING_COLORS.white,
    borderWidth: 1,
    borderColor: "#E2EAF4",
    ...Platform.select({
      web: {
        boxShadow: "0px 14px 40px rgba(8, 21, 47, 0.08)",
        transition: "box-shadow 220ms ease, border-color 220ms ease",
      } as any,
      default: {
        elevation: 5,
        shadowColor: "#08152F",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.07,
        shadowRadius: 24,
      },
    }),
  },
  cardHovered: {
    ...Platform.select({
      web: {
        boxShadow: "0px 22px 56px rgba(8, 21, 47, 0.13)",
        borderColor: "#D2E0F2",
      } as any,
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
    ...Platform.select({
      web: { boxShadow: "0px 10px 22px rgba(8, 21, 47, 0.18)" } as any,
    }),
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
    ...Platform.select({
      web: {
        cursor: "pointer",
        transition: "background-color 160ms ease",
      } as any,
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
