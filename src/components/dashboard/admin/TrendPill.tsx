import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import {
  DASHBOARD_RADIUS,
  type AdminDashboardPalette,
  type TrendDirection,
} from "@/design/adminDashboardTheme";

type TrendPillProps = {
  palette: AdminDashboardPalette;
  /** Percentage change against the same figure a month ago. */
  growth: number;
  /**
   * Overrides the direction implied by `growth`'s sign. Needed where the source
   * reports magnitude and direction as separate fields, so a 0% change keeps
   * the direction the server actually stated.
   */
  direction?: TrendDirection;
  /** Phone sizing — smaller arrow, tighter padding. */
  compact?: boolean;
};

/**
 * Month-over-month change, as a filled pill.
 *
 * The sign is carried by the arrow as well as the fill, so direction is never
 * communicated by colour alone; the magnitude is printed unsigned because the
 * arrow already states which way it went.
 */
export default function TrendPill({
  palette,
  growth,
  direction,
  compact = false,
}: TrendPillProps) {
  const isUp = direction ? direction === "up" : growth >= 0;
  const tone = isUp ? palette.trends.up : palette.trends.down;

  return (
    <View
      accessible
      accessibilityLabel={`${Math.abs(growth)} percent ${
        isUp ? "increase" : "decrease"
      } from last month`}
      className={`shrink-0 flex-row items-center ${
        compact ? "gap-0.5 px-1.5 py-1" : "gap-1 px-2 py-1"
      }`}
      style={{ backgroundColor: tone.bg, borderRadius: DASHBOARD_RADIUS.pill }}
    >
      <Feather
        name={isUp ? "arrow-up" : "arrow-down"}
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
}
