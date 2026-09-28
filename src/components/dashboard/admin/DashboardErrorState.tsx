import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import DashboardButton from "./DashboardButton";

type DashboardErrorStateProps = {
  palette: AdminDashboardPalette;
  onRetry: () => void;
  variant?: "block" | "banner";
  /** The API error, shown under the headline. */
  message?: string | null;
  retrying?: boolean;
};

const DashboardErrorState = ({
  palette,
  onRetry,
  variant = "block",
  message,
  retrying = false,
}: DashboardErrorStateProps) => {
  const isBanner = variant === "banner";

  return (
    <View
      accessibilityRole="alert"
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
          {isBanner ? "Couldn't refresh. Showing the last loaded data." : "Unable to load dashboard data."}
        </Text>
        <Text
          className={`text-[12.5px] ${isBanner ? "" : "text-center"}`}
          style={{ color: palette.muted }}
        >
          {message || "Please check your connection and try again."}
        </Text>
      </View>

      <DashboardButton
        palette={palette}
        variant="primary"
        label="Retry"
        icon="rotate-cw"
        loading={retrying}
        onPress={onRetry}
        accessibilityLabel="Retry loading the dashboard"
      />
    </View>
  );
};

export default DashboardErrorState;
