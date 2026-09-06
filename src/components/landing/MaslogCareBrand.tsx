import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import MaslogCareLogo from "./MaslogCareLogo";

interface MaslogCareBrandProps {
  /** "desktop" for left-aligned, larger; "mobile" for centered, compact */
  variant: "desktop" | "mobile";
}

/**
 * MaslogCare brand header with the Heart vector logo,
 * two-tone brand title ("Maslog" navy + "Care" blue),
 * and system subtitle.
 */
const MaslogCareBrand = ({ variant }: MaslogCareBrandProps) => {
  const isDesktop = variant === "desktop";

  const logoSize = isDesktop ? 98 : 56;
  const titleFontSize = isDesktop ? 54 : 30;
  const subtitleFontSize = isDesktop ? 20 : 13.5;

  return (
    <View style={[styles.container, isDesktop ? styles.desktopAlign : styles.mobileAlign]}>
      {/* Brand logo + text row */}
      <View style={styles.brandRow}>
        <MaslogCareLogo size={logoSize} color={LANDING_COLORS.primaryBlue} />

        <Text
          style={[
            styles.brandText,
            { fontSize: titleFontSize },
          ]}
        >
          <Text style={styles.brandMaslog}>Maslog</Text>
          <Text style={styles.brandCare}>Care</Text>
        </Text>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
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
    gap: 16,
  },
  brandText: {
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  brandMaslog: {
    color: LANDING_COLORS.navy,
  },
  brandCare: {
    color: LANDING_COLORS.primaryBlue,
  },
  subtitle: {
    color: LANDING_COLORS.mutedText,
    fontWeight: "500",
    marginTop: 2,
    letterSpacing: -0.2,
  },
});

export default MaslogCareBrand
