import { Platform, StyleSheet, Text, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";

const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

export default function AuthDivider() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>or</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 2,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2EAF4",
  },
  text: {
    fontSize: 13,
    color: LANDING_COLORS.mutedText,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
  },
});
