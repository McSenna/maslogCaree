import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { resolveStatusBadges, type InventoryItem } from "@/features/inventory/services/inventoryService";
import CategoryBadge from "./CategoryBadge";
import StockStatusBadge from "./StockStatusBadge";
import { CATEGORY_ICONS, useInventoryPalette } from "./inventoryTheme";

type InventoryItemSummaryProps = {
  item: InventoryItem;
  size?: "sm" | "md";
};

const InventoryItemSummary = ({ item, size = "md" }: InventoryItemSummaryProps) => {
  const palette = useInventoryPalette();
  const tone = palette.categories[item.category] ?? palette.categories.other;
  const badges = resolveStatusBadges(item);
  const isSm = size === "sm";

  const iconBox = isSm ? 44 : 48;

  return (
    <View className="w-full flex-row items-start gap-3">
      <View
        className="shrink-0 items-center justify-center"
        style={{ width: iconBox, height: iconBox, backgroundColor: tone.bg, borderRadius: 13 }}
      >
        <MaterialCommunityIcons
          name={CATEGORY_ICONS[item.category] ?? "package-variant-closed"}
          size={isSm ? 22 : 24}
          color={tone.text}
        />
      </View>

      <View className="min-w-0 flex-1 gap-1.5">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text
            className={isSm ? "text-[16px] font-bold" : "text-[18px] font-bold"}
            style={{ color: palette.heading }}
          >
            {item.name}
          </Text>
          <CategoryBadge category={item.category} size="sm" />
        </View>

        <View className="flex-row flex-wrap items-center gap-1.5">
          {badges.map((status) => (
            <StockStatusBadge key={status} status={status} compact />
          ))}
        </View>

        {item.specification ? (
          <Text className="text-[12.5px] font-medium" style={{ color: palette.muted }}>
            {item.specification}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default InventoryItemSummary;
