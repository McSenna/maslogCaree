import { View } from "react-native";
import type { InventorySummary } from "@/services/inventoryService";
import InventoryMetricCard from "./InventoryMetricCard";

type InventoryMetricCardsProps = {
  summary: InventorySummary;
  /** Four across on a wide content area, 2x2 below it. */
  isWide: boolean;
};

export default function InventoryMetricCards({ summary, isWide }: InventoryMetricCardsProps) {
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
        {cards.map((card) => (
          <InventoryMetricCard key={card.metric} {...card} />
        ))}
      </View>
    );
  }

  return (
    <View className="w-full gap-3">
      <View className="flex-row gap-3">
        {cards.slice(0, 2).map((card) => (
          <InventoryMetricCard key={card.metric} {...card} compact />
        ))}
      </View>
      <View className="flex-row gap-3">
        {cards.slice(2).map((card) => (
          <InventoryMetricCard key={card.metric} {...card} compact />
        ))}
      </View>
    </View>
  );
}
