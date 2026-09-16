import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { InventoryItem } from "@/features/inventory/services/inventoryService";
import { CATEGORY_ICONS, useInventoryPalette } from "../inventoryTheme";

const ItemIdentityCell = ({ item }: { item: InventoryItem }) => {
  const palette = useInventoryPalette();
  const tone = palette.categories[item.category] ?? palette.categories.other;

  return (
    <View className="flex-row items-center gap-2.5">
      <View
        className="h-8 w-8 shrink-0 items-center justify-center"
        style={{ backgroundColor: tone.bg, borderRadius: 9 }}
      >
        <MaterialCommunityIcons
          name={CATEGORY_ICONS[item.category] ?? "package-variant-closed"}
          size={17}
          color={tone.text}
        />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[14px] font-bold" numberOfLines={1} style={{ color: palette.heading }}>
          {item.name}
        </Text>
        {item.specification ? (
          <Text className="mt-0.5 text-[12px]" numberOfLines={1} style={{ color: palette.muted }}>
            {item.specification}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default ItemIdentityCell;
