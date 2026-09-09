import { ActivityIndicator, Text, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";

/**
 * Shown while the session, role and platform are still being resolved.
 *
 * The point is what it replaces: without it a protected screen would render
 * for a frame or two before the guard finished and redirected, briefly showing
 * a dashboard to someone not entitled to it. Nothing authenticated renders
 * until every check has finished.
 */
export default function AuthLoadingScreen({
  label = "Verifying your session…",
}: {
  label?: string;
}) {
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: LANDING_COLORS.pageBg }}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
    >
      <ActivityIndicator size="large" color={LANDING_COLORS.primaryBlue} />
      <Text
        style={{
          marginTop: 14,
          fontSize: 13.5,
          fontWeight: "600",
          color: LANDING_COLORS.mutedText,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
