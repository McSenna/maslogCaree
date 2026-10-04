import { View } from "react-native";
import InteractiveCard from "@/components/cards/InteractiveCard";
import UserMetricCard, { type UserMetricCardProps } from "@/features/users/components/UserMetricCard";
import { RADIUS } from "@/features/users/components/usersTheme";
import type { ResidentSummary } from "../services/residentService";
import type { ResidentStatusFilter } from "./residentFilters";

type ResidentSummaryCardsProps = {
  summary: ResidentSummary;
  isWide: boolean;
  activeStatus: ResidentStatusFilter;
  onSelectStatus: (status: ResidentStatusFilter) => void;
};

type CardSpec = Omit<UserMetricCardProps, "compact"> & { filter: ResidentStatusFilter; hint: string };

const ResidentSummaryCards = ({ summary, isWide, activeStatus, onSelectStatus }: ResidentSummaryCardsProps) => {
  const cards: CardSpec[] = [
    {
      metric: "total",
      label: "Total Residents",
      value: summary.total,
      description: "Registered in MaslogCare",
      filter: "all",
      hint: "Shows every resident",
    },
    {
      metric: "active",
      label: "Active Residents",
      value: summary.active,
      description: "Accounts in good standing",
      filter: "active",
      hint: "Shows active residents",
    },
    {
      metric: "suspended",
      label: "Inactive Residents",
      value: summary.inactive + summary.suspended,
      description: "Inactive or suspended",
      filter: "restricted",
      hint: "Shows inactive or suspended residents",
    },
  ];

  // Each card filters the list below to the residents it counts.
  const renderCard = ({ filter, hint, ...card }: CardSpec, compact: boolean) => (
    <InteractiveCard
      key={card.metric}
      onPress={() => onSelectStatus(filter)}
      accessibilityLabel={`${card.label}: ${card.value}. ${card.description}`}
      accessibilityHint={hint}
      selected={activeStatus === filter}
      radius={RADIUS.card}
    >
      <UserMetricCard {...card} growth={null} compact={compact} />
    </InteractiveCard>
  );

  if (isWide) {
    return <View className="w-full flex-row gap-4">{cards.map((card) => renderCard(card, false))}</View>;
  }

  return (
    <View className="w-full gap-3">
      <View className="flex-row gap-3">{cards.slice(0, 2).map((card) => renderCard(card, true))}</View>
      <View className="flex-row gap-3">
        {renderCard(cards[2], true)}
        <View className="min-w-0 flex-1" />
      </View>
    </View>
  );
};

export default ResidentSummaryCards;
