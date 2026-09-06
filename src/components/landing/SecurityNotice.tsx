import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LANDING_COLORS } from "@/config/landingAssets";

const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

/**
 * Small security notice at the bottom of the auth card.
 *
 * [Shield Icon] Your data is secure with MaslogCare
 */
export default function SecurityNotice() {
  return (
    <View style={styles.container}>
      <Ionicons
        name="shield-checkmark-outline"
        size={16}
        color={LANDING_COLORS.mutedText}
      />
      <Text style={styles.text}>Your data is secure with MaslogCare</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingTop: 4,
  },
  text: {
    fontSize: 12.5,
    color: LANDING_COLORS.mutedText,
    fontWeight: "400",
    fontFamily: FONT_FAMILY,
  },
});
