import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import TrendPill from "@/components/dashboard/admin/TrendPill";
import type { SystemLogSeverity, SystemLogStatMetric } from "@/services/systemLogService";
import { formatStatValue } from "@/services/systemLogService";
import { CARD_SHADOW, RADIUS, useSystemLogsPalette } from "./systemLogsTheme";

type LogSummaryCardProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  tone: SystemLogSeverity;
  metric: SystemLogStatMetric;
  /** Phone layout: 2x2 grid, so the card stacks instead of running in a row. */
  compact?: boolean;
};

/**
 * A System Logs summary statistic.
 *
 * Sized and laid out to match the User Management metric cards, so the three
 * admin screens present their figures identically: white card, tone carried by
 * the icon chip, and the period-over-period change as a filled pill beside the
 * label rather than a stacked arrow-and-caption block in the corner.
 */
export default function LogSummaryCard({
  label,
  icon,
  tone,
  metric,
  compact = false,
}: LogSummaryCardProps) {
  const palette = useSystemLogsPalette();
  const toneStyle = palette.severity[tone];

  const surface = {
    backgroundColor: palette.cardBg,
    borderColor: palette.cardBorder,
    borderRadius: RADIUS.card,
    ...CARD_SHADOW,
  };

  const accessibilityLabel = [label, formatStatValue(metric.value), metric.comparisonLabel]
    .filter(Boolean)
    .join(", ");

  // The stats endpoint reports magnitude and direction separately, so the
  // direction is passed through rather than inferred from the sign.
  const trend = (
    <TrendPill
      palette={palette}
      growth={metric.change}
      direction={metric.direction}
      compact={compact}
    />
  );

  if (compact) {
    // Two cards to a 360–430px row leave roughly 100px beside the icon — not
    // enough for "Successful Actions" and its comparison caption to sit there
    // unclipped. The icon and the trend pill take the top line instead, so the
    // label, figure and caption each get the card's full width.
    return (
      <View
        accessible
        accessibilityLabel={accessibilityLabel}
        className="min-w-0 flex-1 border p-3"
        style={surface}
      >
        <View className="flex-row items-start justify-between gap-2">
          <View
            className="h-10 w-10 shrink-0 items-center justify-center"
            style={{ backgroundColor: toneStyle.bg, borderRadius: 12 }}
          >
            <Feather name={icon} size={19} color={toneStyle.dot} />
          </View>
          {trend}
        </View>

        <Text
          className="mt-2.5 text-[13px] font-semibold"
          numberOfLines={1}
          style={{ color: palette.heading }}
        >
          {label}
        </Text>
        <Text
          className="mt-0.5 text-[26px] font-extrabold"
          style={{ color: palette.heading, lineHeight: 32 }}
        >
          {formatStatValue(metric.value)}
        </Text>
        <Text
          className="mt-0.5 text-[11px] font-medium"
          numberOfLines={1}
          style={{ color: palette.muted }}
        >
          {metric.comparisonLabel}
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
        style={{ backgroundColor: toneStyle.bg, borderRadius: 14 }}
      >
        <Feather name={icon} size={22} color={toneStyle.dot} />
      </View>

      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text
            // Wraps rather than truncates: at 1366px four cards across leave
            // roughly 90px beside the trend pill, which "Successful Actions"
            // does not fit on one line. The row stretches all four to match.
            className="min-w-0 flex-1 text-[14px] font-semibold"
            numberOfLines={2}
            style={{ color: palette.heading }}
          >
            {label}
          </Text>
          {trend}
        </View>

        <Text
          className="mt-0.5 text-[30px] font-extrabold"
          style={{ color: palette.heading, lineHeight: 36 }}
        >
          {formatStatValue(metric.value)}
        </Text>
        <Text
          className="mt-0.5 text-[12px] font-medium"
          numberOfLines={1}
          style={{ color: palette.muted }}
        >
          {metric.comparisonLabel}
        </Text>
      </View>
    </View>
  );
}
