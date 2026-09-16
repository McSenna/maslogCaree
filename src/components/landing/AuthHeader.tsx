import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import {
  headingLineHeight,
  subtitleLineHeight,
} from "@/features/auth/components/authCardMetrics";

const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

interface AuthHeaderProps {
  centered?: boolean;
  compact?: boolean;
  headingSize?: number;
  subtitleSize?: number;
  gap?: number;
}

const AuthHeader = ({
  centered = false,
  compact = false,
  headingSize,
  subtitleSize,
  gap,
}: AuthHeaderProps) => {
  const headingType =
    headingSize === undefined
      ? undefined
      : { fontSize: headingSize, lineHeight: headingLineHeight(headingSize) };
  const subtitleType =
    subtitleSize === undefined
      ? undefined
      : { fontSize: subtitleSize, lineHeight: subtitleLineHeight(subtitleSize) };

  return (
    <View
      style={[
        styles.container,
        centered && styles.centered,
        gap === undefined ? null : { gap },
      ]}
    >
      <Text
        style={[
          styles.heading,
          compact && styles.headingCompact,
          centered && styles.centeredText,
          headingType,
        ]}
      >
        Welcome Back 👋
      </Text>
      <Text
        style={[
          styles.subtitle,
          compact && styles.subtitleCompact,
          centered && styles.centeredText,
          subtitleType,
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