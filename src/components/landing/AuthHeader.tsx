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
}


const AuthHeader = ({ centered = false }: AuthHeaderProps) => {
  return (
    <View style={[styles.container, centered && styles.centered]}>
      <Text style={[styles.heading, centered && styles.centeredText]}>
        Hello, Welcome Back👋
      </Text>
      <Text style={[styles.subtitle, centered && styles.centeredText]}>
        Sign in to continue to MaslogCare
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  centered: {
    alignItems: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: LANDING_COLORS.navy,
    letterSpacing: -0.3,
    fontFamily: FONT_FAMILY,
  },
  subtitle: {
    fontSize: 15,
    color: LANDING_COLORS.mutedText,
    fontWeight: "400",
    lineHeight: 21,
    fontFamily: FONT_FAMILY,
  },
  centeredText: {
    textAlign: "center",
  },
});

export default AuthHeader