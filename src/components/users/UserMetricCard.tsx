import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import {
  CARD_SHADOW,
  METRIC_ICONS,
  RADIUS,
  useUsersPalette,
  type MetricKey,
} from "./usersTheme";

export type UserMetricCardProps = {
  metric: MetricKey;
  label: string;
  value: number;
  description: string;
  /**
   * Percentage change against the same figure a month ago. Omitted when the
   * data cannot support one, in which case the pill is simply not drawn.
   */
  growth?: number | null;
  /** Phone layout: 2x2 grid, so the card stacks instead of running in a row. */
  compact?: boolean;
};

function TrendPill({ growth, compact }: { growth: number; compact: boolean }) {
  const palette = useUsersPalette();
  const isUp = growth >= 0;
  const tone = isUp ? palette.trends.up : palette.trends.down;

  return (
    <View
      accessible
      accessibilityLabel={`${Math.abs(growth)} percent ${isUp ? "increase" : "decrease"} from last month`}
      className={`shrink-0 flex-row items-center ${compact ? "gap-0.5 px-1.5 py-1" : "gap-1 px-2 py-1"}`}
      style={{ backgroundColor: tone.bg, borderRadius: RADIUS.pill }}
    >
      <Feather name={isUp ? "arrow-up" : "arrow-down"} size={compact ? 10 : 12} color={tone.text} />
      <Text
        className={compact ? "text-[11px] font-semibold" : "text-[12px] font-semibold"}
        style={{ color: tone.text }}
      >
        {Math.abs(growth)}%
      </Text>
    </View>
  );
}

export default function UserMetricCard({
  metric,
  label,
  value,
  description,
  growth,
  compact = false,
}: UserMetricCardProps) {
  const palette = useUsersPalette();
  const tone = palette.metrics[metric];
  const showTrend = typeof growth === "number" && Number.isFinite(growth);

  const surface = {
    backgroundColor: palette.cardBg,
    borderColor: palette.cardBorder,
    borderRadius: RADIUS.card,
    ...CARD_SHADOW,
  };

  const accessibilityLabel = [label, String(value), description].filter(Boolean).join(", ");

  if (compact) {
    // Two cards to a 360–430px row leave roughly 100px beside the icon — not
    // enough for "Suspended Users" and "Inactive or suspended" to sit there
    // unclipped. The icon and the trend pill take the top line instead, so the
    // label, figure and caption each get the card's full width.
    return (
      <View accessible accessibilityLabel={accessibilityLabel} className="min-w-0 flex-1 border p-3" style={surface}>
        <View className="flex-row items-start justify-between gap-2">
          <View
            className="h-10 w-10 shrink-0 items-center justify-center"
            style={{ backgroundColor: tone.iconBg, borderRadius: 12 }}
          >
            <Feather name={METRIC_ICONS[metric]} size={19} color={tone.icon} />
          </View>
          {showTrend ? <TrendPill growth={growth as number} compact /> : null}
        </View>

        <Text className="mt-2.5 text-[13px] font-semibold" numberOfLines={1} style={{ color: palette.heading }}>
          {label}
        </Text>
        <Text className="mt-0.5 text-[26px] font-extrabold" style={{ color: palette.heading, lineHeight: 32 }}>
          {value.toLocaleString()}
        </Text>
        <Text className="mt-0.5 text-[11px] font-medium" numberOfLines={1} style={{ color: palette.muted }}>
          {description}
        </Text>
      </View>
    );
  }

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      className="min-w-0 flex-1 flex-row items-center gap-3.5 border p-4"
      style={surface}
    >
      <View
        className="h-12 w-12 shrink-0 items-center justify-center"
        style={{ backgroundColor: tone.iconBg, borderRadius: 14 }}
      >
        <Feather name={METRIC_ICONS[metric]} size={22} color={tone.icon} />
      </View>

      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text
            // Wraps rather than truncates: at 1366px four cards across leave
            // roughly 90px beside the trend pill, which "Suspended Users" does
            // not fit on one line. The row stretches all four to match.
            className="min-w-0 flex-1 text-[14px] font-semibold"
            numberOfLines={2}
            style={{ color: palette.heading }}
          >
            {label}
          </Text>
          {showTrend ? <TrendPill growth={growth as number} compact={false} /> : null}
        </View>

        <Text className="mt-0.5 text-[30px] font-extrabold" style={{ color: palette.heading, lineHeight: 36 }}>
          {value.toLocaleString()}
        </Text>
        <Text className="mt-0.5 text-[12px] font-medium" numberOfLines={1} style={{ color: palette.muted }}>
          {description}
        </Text>
      </View>
    </View>
  );
}
