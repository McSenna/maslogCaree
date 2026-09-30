import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LANDING_COLORS } from "@/config/landingAssets";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import {
  EYEBROW_LINE_HEIGHT,
  EYEBROW_PADDING_VERTICAL,
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
  headingSize: number;
  subtitleSize: number;
  gap: number;
  eyebrowGap: number;
}

const AuthHeader = ({
  centered = false,
  headingSize,
  subtitleSize,
  gap,
  eyebrowGap,
}: AuthHeaderProps) => {
  return (
    <View>
      <View
        style={[
          styles.eyebrow,
          { alignSelf: centered ? "center" : "flex-start", marginBottom: eyebrowGap },
        ]}
      >
        <Feather name="user" size={13} color={LANDING_COLORS.primaryBlue} />
        <Text style={styles.eyebrowText}>MaslogCare account</Text>
      </View>

      <View style={[centered && styles.centered, { gap }]}>
        <Text
          accessibilityRole="header"
          style={[
            styles.heading,
            centered && styles.centeredText,
            { fontSize: headingSize, lineHeight: headingLineHeight(headingSize) },
          ]}
        >
          Welcome back
        </Text>
        <Text
          style={[
            styles.subtitle,
            centered && styles.centeredText,
            { fontSize: subtitleSize, lineHeight: subtitleLineHeight(subtitleSize) },
          ]}
        >
          Sign in with your email or mobile number.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
  },
  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingVertical: EYEBROW_PADDING_VERTICAL,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADII.small,
    backgroundColor: LANDING_COLORS.softBlue,
  },
  eyebrowText: {
    ...TYPE.caption,
    lineHeight: EYEBROW_LINE_HEIGHT,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: LANDING_COLORS.primaryBlue,
    fontFamily: FONT_FAMILY,
  },
  heading: {
    fontWeight: "800",
    color: LANDING_COLORS.navy,
    letterSpacing: -0.3,
    fontFamily: FONT_FAMILY,
  },
  subtitle: {
    color: LANDING_COLORS.mutedText,
    fontWeight: "400",
    fontFamily: FONT_FAMILY,
  },
  centeredText: {
    textAlign: "center",
  },
});

export default AuthHeader;
