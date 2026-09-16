import { Platform, StyleSheet } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import { FONT_FAMILY } from "./authCardFont";

export const authCardStyles = StyleSheet.create({
  card: {
    backgroundColor: LANDING_COLORS.white,
    borderWidth: 1,
    borderColor: "#E2EAF4",
    ...Platform.select({
      web: {
        boxShadow: "0px 14px 40px rgba(8, 21, 47, 0.08)",
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
  cardDesktop: {
    width: "100%",
    maxWidth: 446,
  },
  cardDesktopCompact: {
    width: "100%",
    maxWidth: 404,
  },
  cardMobile: {
    width: "100%",
  },

  form: {
    flexDirection: "column",
  },

  loginButton: {
    backgroundColor: LANDING_COLORS.primaryBlue,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
        transition: "background-color 0.15s ease, opacity 0.15s ease, transform 0.1s ease",
      } as any,
    }),
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
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  forgotContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    ...Platform.select({
      web: {
        cursor: "pointer",
      } as any,
    }),
  },
  forgotText: {
    color: LANDING_COLORS.primaryBlue,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
  },

  createButton: {
    backgroundColor: LANDING_COLORS.green,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
        transition: "background-color 0.15s ease, opacity 0.15s ease, transform 0.1s ease",
      } as any,
    }),
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
