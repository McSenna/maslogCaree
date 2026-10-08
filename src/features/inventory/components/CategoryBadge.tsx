import { Badge } from "@/components/data-table";
import type { InventoryCategory } from "@/features/inventory/services/inventoryService";

import { useInventoryPalette } from "./inventoryTheme";

type CategoryBadgeProps = {
  category: InventoryCategory;
  size?: "sm" | "md";
};

/** An item's category in its own hue. Categories are not states, so the chip carries no icon. */
const CategoryBadge = ({ category, size = "sm" }: CategoryBadgeProps) => {
  const palette = useInventoryPalette();
  const tone = palette.categories[category] ?? palette.categories.other;
  return <Badge tone={{ bg: tone.bg, fg: tone.text }} label={tone.label} spokenAs="Category" size={size} />;
};

export default CategoryBadge;
