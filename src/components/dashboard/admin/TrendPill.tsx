import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import {
  DASHBOARD_RADIUS,
  type AdminDashboardPalette,
  type TrendDirection,
} from "@/design/adminDashboardTheme";

type TrendPillProps = {
  palette: AdminDashboardPalette;
  growth: number;
  direction?: TrendDirection;
  compact?: boolean;
};

const TrendPill = ({
  palette,
  growth,
  direction,
  compact = false,
}: TrendPillProps) => {
  // Zero change is neither good nor bad news, so it is grey rather than a green "up".
  const isFlat = !direction && growth === 0;
  const isUp = direction ? direction === "up" : growth > 0;
  const tone = isFlat
    ? { text: palette.muted, bg: palette.divider }
    : isUp
      ? palette.trends.up
      : palette.trends.down;

  return (
    <View
      accessible
      accessibilityLabel={
        isFlat
          ? "No change from last month"
          : `${Math.abs(growth)} percent ${isUp ? "increase" : "decrease"} from last month`
      }
      className={`shrink-0 flex-row items-center ${
        compact ? "gap-0.5 px-1.5 py-1" : "gap-1 px-2 py-1"
      }`}
      style={{ backgroundColor: tone.bg, borderRadius: DASHBOARD_RADIUS.pill }}
    >
      <Feather
        name={isFlat ? "minus" : isUp ? "arrow-up" : "arrow-down"}
        size={compact ? 10 : 12}
        color={tone.text}
      />
      <Text
        className={compact ? "text-[11px] font-semibold" : "text-[12px] font-semibold"}
        style={{ color: tone.text }}
      >
        {Math.abs(growth)}%
      </Text>
    </View>
  );
};

export default TrendPill;
