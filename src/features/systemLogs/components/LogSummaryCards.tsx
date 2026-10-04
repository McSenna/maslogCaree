import { View } from "react-native";
import InteractiveCard from "@/components/cards/InteractiveCard";
import type { SystemLogStatsResponse } from "@/features/systemLogs/services/systemLogService";
import { formatStatValue } from "@/features/systemLogs/services/systemLogService";
import LogSummaryCard from "./LogSummaryCard";
import { RADIUS, SUMMARY_CARD_META } from "./systemLogsTheme";
import { LOG_CARD_HINTS, type LogCardKey } from "./toolbar/logCardFilters";

type LogSummaryCardsProps = {
  stats: SystemLogStatsResponse["stats"] | null;
  isDesktop: boolean;
  activeCard: LogCardKey | null;
  onSelectCard: (key: LogCardKey) => void;
};

const PLACEHOLDER_METRIC = { value: 0, change: 0, direction: "up" as const, comparisonLabel: "" };

const CARD_KEYS: LogCardKey[] = ["totalLogs", "errorsToday", "warnings", "successfulActions"];

const LogSummaryCards = ({ stats, isDesktop, activeCard, onSelectCard }: LogSummaryCardsProps) => {
  // Each card filters the log list to the entries it counts.
  const renderCard = (key: LogCardKey, compact: boolean) => {
    const meta = SUMMARY_CARD_META[key];
    const metric = stats?.[key] ?? PLACEHOLDER_METRIC;
    return (
      <InteractiveCard
        key={key}
        onPress={() => onSelectCard(key)}
        accessibilityLabel={[meta.label, formatStatValue(metric.value), metric.comparisonLabel].filter(Boolean).join(", ")}
        accessibilityHint={LOG_CARD_HINTS[key]}
        selected={activeCard === key}
        radius={RADIUS.card}
      >
        <LogSummaryCard label={meta.label} icon={meta.icon} tone={meta.tone} metric={metric} compact={compact} />
      </InteractiveCard>
    );
  };

  if (isDesktop) {
    return <View className="w-full flex-row gap-4">{CARD_KEYS.map((key) => renderCard(key, false))}</View>;
  }

  return (
    <View className="w-full gap-3">
      <View className="flex-row gap-3">{CARD_KEYS.slice(0, 2).map((key) => renderCard(key, true))}</View>
      <View className="flex-row gap-3">{CARD_KEYS.slice(2).map((key) => renderCard(key, true))}</View>
    </View>
  );
};

export default LogSummaryCards;
