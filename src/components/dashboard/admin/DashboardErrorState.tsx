import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

type DashboardErrorStateProps = {
  palette: AdminDashboardPalette;
  onRetry: () => void;
  /** Inline banner above still-visible data, vs. the full-panel empty case. */
  variant?: "block" | "banner";
};

/**
 * The only failure message the dashboard shows.
 *
 * The normalized API error is deliberately not rendered: status codes and
 * transport strings mean nothing to an administrator, and the recovery is the
 * same in every case.
 */
export default function DashboardErrorState({
  palette,
  onRetry,
  variant = "block",
}: DashboardErrorStateProps) {
  const isBanner = variant === "banner";

  return (
    <View
      className={`rounded-2xl border ${isBanner ? "flex-row items-center gap-3 p-3.5" : "items-center gap-3 p-8"}`}
      style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}
    >
      <View
        className="h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${palette.negative}1A` }}
      >
        <Feather name="alert-circle" size={19} color={palette.negative} />
      </View>

      <View className={isBanner ? "min-w-0 flex-1 gap-0.5" : "items-center gap-1"}>
        <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
          Unable to load dashboard data.
        </Text>
        <Text
          className={`text-[12.5px] ${isBanner ? "" : "text-center"}`}
          style={{ color: palette.muted }}
        >
          Please check your connection and try again.
        </Text>
      </View>

      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry loading the dashboard"
        className="shrink-0 rounded-xl px-5 py-2.5"
        style={({ pressed }) => ({
          backgroundColor: palette.primary,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text className="text-[13px] font-semibold text-white">Retry</Text>
      </Pressable>
    </View>
  );
}
