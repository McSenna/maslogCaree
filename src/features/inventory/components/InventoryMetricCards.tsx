import { View } from "react-native";
import InteractiveCard from "@/components/cards/InteractiveCard";
import type { InventorySummary } from "@/features/inventory/services/inventoryService";
import { CARD_HINTS } from "./inventoryCardFilters";
import InventoryMetricCard, { type InventoryMetricCardProps } from "./InventoryMetricCard";
import { RADIUS, type InventoryMetricKey } from "./inventoryTheme";

type InventoryMetricCardsProps = {
  summary: InventorySummary;
  isWide: boolean;
  activeCard: InventoryMetricKey | null;
  onSelectCard: (key: InventoryMetricKey) => void;
};

const InventoryMetricCards = ({ summary, isWide, activeCard, onSelectCard }: InventoryMetricCardsProps) => {
  // Each card filters the list below to what it counts.
  const renderCard = (card: InventoryMetricCardProps, compact: boolean) => (
    <InteractiveCard
      key={card.metric}
      onPress={() => onSelectCard(card.metric)}
      accessibilityLabel={`${card.label}: ${card.value}. ${card.description}`}
      accessibilityHint={CARD_HINTS[card.metric]}
      selected={activeCard === card.metric}
      radius={RADIUS.card}
    >
      <InventoryMetricCard {...card} compact={compact} />
    </InteractiveCard>
  );

  const cards = [
    {
      metric: "total" as const,
      label: "Total Inventory Items",
      value: summary.total.value,
      description: "All medicines and supplies",
      growth: summary.total.growth,
    },
    {
      metric: "inStock" as const,
      label: "In Stock",
      value: summary.inStock.value,
      description: "Items available",
      growth: summary.inStock.growth,
    },
    {
      metric: "lowStock" as const,
      label: "Low Stock",
      value: summary.lowStock.value,
      description: "Items at or below reorder level",
      growth: summary.lowStock.growth,
    },
    {
      metric: "expiringSoon" as const,
      label: "Expiring Soon",
      value: summary.expiringSoon.value,
      description: "Items expiring within 3 months",
      growth: summary.expiringSoon.growth,
    },
  ];

  if (isWide) {
    return (
      <View className="w-full flex-row gap-4">
        {cards.map((card) => renderCard(card, false))}
      </View>
    );
  }

  return (
    <View className="w-full gap-3">
      <View className="flex-row gap-3">
        {cards.slice(0, 2).map((card) => renderCard(card, true))}
      </View>
      <View className="flex-row gap-3">
        {cards.slice(2).map((card) => renderCard(card, true))}
      </View>
    </View>
  );
};

export default InventoryMetricCards;
