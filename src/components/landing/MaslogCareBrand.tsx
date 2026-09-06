import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import MaslogCareLogo from "./MaslogCareLogo";

const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

interface MaslogCareBrandProps {
  variant: "desktop" | "mobile";
  compact?: boolean;
}


const MaslogCareBrand = ({ variant, compact = false }: MaslogCareBrandProps) => {
  const isDesktop = variant === "desktop";

  const logoSize = isDesktop ? (compact ? 84 : 112) : 66;
  const titleFontSize = isDesktop ? (compact ? 44 : 58) : 35;
  const rowGap = isDesktop ? (compact ? 11 : 14) : 10;

  return (
    <View style={[styles.container, isDesktop ? styles.desktopAlign : styles.mobileAlign]}>
      <View style={[styles.brandRow, { gap: rowGap }]}>
        <MaslogCareLogo size={logoSize} color={LANDING_COLORS.primaryBlue} />

        <Text style={[styles.brandText, { fontSize: titleFontSize }]}>
          <Text style={styles.brandMaslog}>Maslog</Text>
          <Text style={styles.brandCare}>Care</Text>
        </Text>
      </View>

      {isDesktop && (
        <Text
          style={[
            styles.subtitle,
            compact && styles.subtitleCompact,
            // Optically aligns with the wordmark's left edge.
            { marginLeft: logoSize + rowGap },
          ]}
        >

        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  desktopAlign: {
    alignItems: "flex-start",
  },
  mobileAlign: {
    alignItems: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: {
    fontWeight: "800",
    letterSpacing: -1,
    fontFamily: FONT_FAMILY,
  },
  brandMaslog: {
    color: LANDING_COLORS.navy,
  },
  brandCare: {
    color: LANDING_COLORS.primaryBlue,
  },
  subtitle: {
    fontSize: 24,
    lineHeight: 33,
    color: "#5B6B85",
    fontWeight: "400",
    letterSpacing: -0.2,
    fontFamily: FONT_FAMILY,
    marginTop: 2,
  },
  subtitleCompact: {
    fontSize: 19,
    lineHeight: 26,
  },
});

export default MaslogCareBrand;
