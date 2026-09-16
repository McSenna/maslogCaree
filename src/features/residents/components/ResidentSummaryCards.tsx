import { View } from "react-native";
import UserMetricCard from "@/features/users/components/UserMetricCard";
import type { ResidentSummary } from "../services/residentService";

type ResidentSummaryCardsProps = {
  summary: ResidentSummary;
  isWide: boolean;
};

const ResidentSummaryCards = ({ summary, isWide }: ResidentSummaryCardsProps) => {
  const cards = [
    {
      metric: "total" as const,
      label: "Total Residents",
      value: summary.total,
      description: "Registered in MaslogCare",
    },
    {
      metric: "active" as const,
      label: "Active Residents",
      value: summary.active,
      description: "Accounts in good standing",
    },
    {
      metric: "suspended" as const,
      label: "Inactive Residents",
      value: summary.inactive + summary.suspended,
      description: "Inactive or suspended",
    },
  ];

  if (isWide) {
    return (
      <View className="w-full flex-row gap-4">
        {cards.map((card) => (
          <UserMetricCard key={card.metric} {...card} growth={null} />
        ))}
      </View>
    );
  }

  return (
    <View className="w-full gap-3">
      <View className="flex-row gap-3">
        {cards.slice(0, 2).map((card) => (
          <UserMetricCard key={card.metric} {...card} growth={null} compact />
        ))}
      </View>
      <View className="flex-row gap-3">
        <UserMetricCard {...cards[2]} growth={null} compact />
        <View className="min-w-0 flex-1" />
      </View>
    </View>
  );
};

export default ResidentSummaryCards;
