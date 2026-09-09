import { Text, View } from "react-native";
import type { InventoryCategory } from "@/services/inventoryService";
import { RADIUS, useInventoryPalette } from "./inventoryTheme";

type CategoryBadgeProps = {
  category: InventoryCategory;
  size?: "sm" | "md";
};

/**
 * Category identity pill — the same colours in the table, the mobile cards and
 * the details panel, so a category reads the same everywhere.
 */
export default function CategoryBadge({ category, size = "md" }: CategoryBadgeProps) {
  const palette = useInventoryPalette();
  const tone = palette.categories[category] ?? palette.categories.other;
  const isSm = size === "sm";

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Category: ${tone.label}`}
      className={`self-start ${isSm ? "px-2 py-1" : "px-2.5 py-1.5"}`}
      style={{ backgroundColor: tone.bg, borderRadius: RADIUS.pill }}
    >
      <Text
        numberOfLines={1}
        className={isSm ? "text-[11px] font-semibold" : "text-[12px] font-semibold"}
        style={{ color: tone.text }}
      >
        {tone.label}
      </Text>
    </View>
  );
}
