import { View } from "react-native";
import type { SystemLogStatsResponse } from "@/features/systemLogs/services/systemLogService";
import LogSummaryCard from "./LogSummaryCard";
import { SUMMARY_CARD_META } from "./systemLogsTheme";

type LogSummaryCardsProps = {
  stats: SystemLogStatsResponse["stats"] | null;
  isDesktop: boolean;
};

const PLACEHOLDER_METRIC = { value: 0, change: 0, direction: "up" as const, comparisonLabel: "" };

const LogSummaryCards = ({ stats, isDesktop }: LogSummaryCardsProps) => {
  const cards = [
    { key: "totalLogs", metric: stats?.totalLogs ?? PLACEHOLDER_METRIC, ...SUMMARY_CARD_META.totalLogs },
    { key: "errorsToday", metric: stats?.errorsToday ?? PLACEHOLDER_METRIC, ...SUMMARY_CARD_META.errorsToday },
    { key: "warnings", metric: stats?.warnings ?? PLACEHOLDER_METRIC, ...SUMMARY_CARD_META.warnings },
    {
      key: "successfulActions",
      metric: stats?.successfulActions ?? PLACEHOLDER_METRIC,
      ...SUMMARY_CARD_META.successfulActions,
    },
  ];

  if (isDesktop) {
    return (
      <View className="w-full flex-row gap-4">
        {cards.map((card) => (
          <LogSummaryCard
            key={card.key}
            label={card.label}
            icon={card.icon}
            tone={card.tone}
            metric={card.metric}
          />
        ))}
      </View>
    );
  }

  return (
    <View className="w-full gap-3">
      <View className="flex-row gap-3">
        {cards.slice(0, 2).map((card) => (
          <LogSummaryCard
            key={card.key}
            label={card.label}
            icon={card.icon}
            tone={card.tone}
            metric={card.metric}
            compact
          />
        ))}
      </View>
      <View className="flex-row gap-3">
        {cards.slice(2).map((card) => (
          <LogSummaryCard
            key={card.key}
            label={card.label}
            icon={card.icon}
            tone={card.tone}
            metric={card.metric}
            compact
          />
        ))}
      </View>
    </View>
  );
};

export default LogSummaryCards;
