import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LANDING_COLORS } from "@/config/landingAssets";
import { SECURITY_NOTICE } from "@/config/landingContent";
import {
  SECURITY_NOTICE_FONT_SIZE,
  SECURITY_NOTICE_LINE_HEIGHT,
} from "@/features/auth/components/authCardMetrics";

const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

const SecurityNotice = () => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="shield-checkmark-outline"
        size={16}
        color={LANDING_COLORS.mutedText}
      />
      <Text style={styles.text}>{SECURITY_NOTICE}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingTop: 4,
  },
  text: {
    flexShrink: 1,
    textAlign: "center",
    fontSize: SECURITY_NOTICE_FONT_SIZE,
    lineHeight: SECURITY_NOTICE_LINE_HEIGHT,
    color: LANDING_COLORS.mutedText,
    fontWeight: "400",
    fontFamily: FONT_FAMILY,
  },
});

export default SecurityNotice;
