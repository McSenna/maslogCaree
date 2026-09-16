import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import SearchField from "@/components/ui/SearchField";
import { CONTROL_HEIGHT, RADIUS, useInventoryPalette } from "./inventoryTheme";

type InventoryMobileToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilterCount: number;
  sortLabel: string;
  onOpenFilters: () => void;
  onOpenSort: () => void;
  onAddItem: () => void;
  canAddItem: boolean;
  resultCount: number;
};

const ToolbarButton = ({
  label,
  icon,
  onPress,
  badgeCount = 0,
  accessibilityLabel,
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  badgeCount?: number;
  accessibilityLabel: string;
}) => {
  const palette = useInventoryPalette();
  const active = badgeCount > 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="min-w-0 flex-1 flex-row items-center justify-center gap-2 border px-3 active:opacity-85"
      style={{
        height: CONTROL_HEIGHT,
        borderRadius: RADIUS.control,
        backgroundColor: active ? palette.bannerBg : palette.cardBg,
        borderColor: active ? palette.primary : palette.cardBorder,
      }}
    >
      <Feather name={icon} size={15} color={active ? palette.primary : palette.body} />
      <Text
        className="text-[13.5px] font-semibold"
        numberOfLines={1}
        style={{ color: active ? palette.primary : palette.body }}
      >
        {label}
      </Text>
      {active ? (
        <View
          className="items-center justify-center px-1.5"
          style={{ minWidth: 20, height: 20, borderRadius: 10, backgroundColor: palette.primary }}
        >
          <Text className="text-[11px] font-bold text-white">{badgeCount}</Text>
        </View>
      ) : null}
    </Pressable>
  );
};

const InventoryMobileToolbar = ({
  search,
  onSearchChange,
  activeFilterCount,
  sortLabel,
  onOpenFilters,
  onOpenSort,
  onAddItem,
  canAddItem,
  resultCount,
}: InventoryMobileToolbarProps) => {
  const palette = useInventoryPalette();

  return (
    <View className="w-full gap-3">
      <SearchField
        value={search}
        onChangeText={onSearchChange}
        placeholder="Search inventory..."
        accessibilityLabel="Search inventory by name, batch number, category or supplier"
      />

      <View className="w-full flex-row gap-2">
        <ToolbarButton
          label="Filters"
          icon="sliders"
          onPress={onOpenFilters}
          badgeCount={activeFilterCount}
          accessibilityLabel={
            activeFilterCount > 0
              ? `Filters, ${activeFilterCount} active`
              : "Filters"
          }
        />
        <ToolbarButton
          label="Sort"
          icon="chevrons-down"
          onPress={onOpenSort}
          accessibilityLabel={`Sort, currently ${sortLabel}`}
        />
      </View>

      <View className="w-full flex-row items-center justify-between gap-3">
        <Text className="text-[15px] font-semibold" style={{ color: palette.heading }}>
          {resultCount.toLocaleString()} {resultCount === 1 ? "item" : "items"}
        </Text>
        {canAddItem ? (
          <Pressable
            onPress={onAddItem}
            accessibilityRole="button"
            accessibilityLabel="Add inventory item"
            className="flex-row items-center justify-center gap-2 px-5 active:opacity-85"
            style={{
              height: CONTROL_HEIGHT,
              borderRadius: RADIUS.control,
              backgroundColor: palette.primary,
            }}
          >
            <Feather name="plus" size={17} color="#FFFFFF" />
            <Text className="text-[14px] font-semibold text-white">Add Item</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default InventoryMobileToolbar;
