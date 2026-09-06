import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";

const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

interface AuthHeaderProps {
  centered?: boolean;
  /** Mobile uses slightly smaller type than the 1920×1080 desktop card. */
  compact?: boolean;
}

const AuthHeader = ({ centered = false, compact = false }: AuthHeaderProps) => {
  return (
    <View style={[styles.container, centered && styles.centered]}>
      <Text
        style={[
          styles.heading,
          compact && styles.headingCompact,
          centered && styles.centeredText,
        ]}
      >
        Welcome Back 👋
      </Text>
      <Text
        style={[
          styles.subtitle,
          compact && styles.subtitleCompact,
          centered && styles.centeredText,
        ]}
      >
        Sign in to continue to MaslogCare
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 7,
  },
  centered: {
    alignItems: "center",
  },
  heading: {
    fontSize: 29,
    fontWeight: "800",
    color: LANDING_COLORS.navy,
    letterSpacing: -0.3,
    fontFamily: FONT_FAMILY,
  },
  headingCompact: {
    fontSize: 25,
  },
  subtitle: {
    fontSize: 16,
    color: LANDING_COLORS.mutedText,
    fontWeight: "400",
    lineHeight: 23,
    fontFamily: FONT_FAMILY,
  },
  subtitleCompact: {
    fontSize: 15,
    lineHeight: 21,
  },
  centeredText: {
    textAlign: "center",
  },
});

export default AuthHeader