import { Platform, StyleSheet, Text, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import { LANDING_CONTENT } from "@/config/landingContent";

const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

type LandingHeadlineProps = {
  headlineSize: number;
  descriptionSize: number;
  gap: number;
};

const LandingHeadline = ({ headlineSize, descriptionSize, gap }: LandingHeadlineProps) => {
  return (
    <View style={[styles.container, { gap }]}>
      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowDot} />
        <Text style={styles.eyebrow}>{LANDING_CONTENT.eyebrow}</Text>
      </View>

      <Text
        accessibilityRole="header"
        style={[
          styles.headline,
          { fontSize: headlineSize, lineHeight: Math.round(headlineSize * 1.14) },
        ]}
      >
        {LANDING_CONTENT.headline.lead}
        {"\n"}
        <Text style={styles.headlineAccent}>{LANDING_CONTENT.headline.accent}</Text>
      </Text>

      <Text
        style={[
          styles.description,
          { fontSize: descriptionSize, lineHeight: Math.round(descriptionSize * 1.55) },
        ]}
      >
        {LANDING_CONTENT.description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 620,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: LANDING_COLORS.softBlue,
  },
  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: LANDING_COLORS.green,
  },
  eyebrow: {
    fontSize: 12.5,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: LANDING_COLORS.primaryBlue,
    fontFamily: FONT_FAMILY,
  },
  headline: {
    fontWeight: "800",
    letterSpacing: -1,
    color: LANDING_COLORS.navy,
    fontFamily: FONT_FAMILY,
  },
  headlineAccent: {
    color: LANDING_COLORS.primaryBlue,
  },
  description: {
    color: "#475569",
    fontWeight: "400",
    letterSpacing: -0.1,
    fontFamily: FONT_FAMILY,
  },
});

export default LandingHeadline;
