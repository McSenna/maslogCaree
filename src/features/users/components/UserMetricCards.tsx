import { View } from "react-native";
import UserMetricCard from "./UserMetricCard";
import type { UserMetrics } from "./userMetrics";

type UserMetricCardsProps = {
  metrics: UserMetrics;
  /** Four across on a wide content area, 2x2 below it. */
  isWide: boolean;
};

export default function UserMetricCards({ metrics, isWide }: UserMetricCardsProps) {
  const cards = [
    {
      metric: "total" as const,
      label: "Total Users",
      value: metrics.total.value,
      description: "All registered users",
      growth: metrics.total.growth,
    },
    {
      metric: "active" as const,
      label: "Active Users",
      value: metrics.active.value,
      description: "Currently active",
      growth: metrics.active.growth,
    },
    {
      metric: "new" as const,
      label: "New Users",
      value: metrics.new.value,
      description: "Added this month",
      growth: metrics.new.growth,
    },
    {
      metric: "suspended" as const,
      label: "Suspended Users",
      value: metrics.suspended.value,
      description: "Inactive or suspended",
      growth: metrics.suspended.growth,
    },
  ];

  if (isWide) {
    return (
      <View className="w-full flex-row gap-4">
        {cards.map((card) => (
          <UserMetricCard key={card.metric} {...card} />
        ))}
      </View>
    );
  }

  return (
    <View className="w-full gap-3">
      <View className="flex-row gap-3">
        {cards.slice(0, 2).map((card) => (
          <UserMetricCard key={card.metric} {...card} compact />
        ))}
      </View>
      <View className="flex-row gap-3">
        {cards.slice(2).map((card) => (
          <UserMetricCard key={card.metric} {...card} compact />
        ))}
      </View>
    </View>
  );
}
