import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import TrendPill from "@/components/dashboard/admin/TrendPill";
import type { SystemLogSeverity, SystemLogStatMetric } from "@/features/systemLogs/services/systemLogService";
import { formatStatValue } from "@/features/systemLogs/services/systemLogService";
import { CARD_SHADOW, RADIUS, useSystemLogsPalette } from "./systemLogsTheme";

type LogSummaryCardProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  tone: SystemLogSeverity;
  metric: SystemLogStatMetric;
  compact?: boolean;
};

const LogSummaryCard = ({
  label,
  icon,
  tone,
  metric,
  compact = false,
}: LogSummaryCardProps) => {
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

  const trend = (
    <TrendPill
      palette={palette}
      growth={metric.change}
      direction={metric.direction}
      compact={compact}
    />
  );

  if (compact) {
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
};

export default LogSummaryCard;
