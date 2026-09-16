import { Text, View } from "react-native";
import SearchField from "@/components/ui/SearchField";
import SelectMenu from "@/components/ui/SelectMenu";
import {
  CATEGORY_FILTER_OPTIONS,
  EXPIRY_STATUS_FILTER_OPTIONS,
  SORT_OPTIONS,
  STOCK_STATUS_FILTER_OPTIONS,
} from "../inventoryFilters";
import { CONTROL_HEIGHT, useInventoryPalette } from "../inventoryTheme";
import AddItemButton from "./AddItemButton";
import { SEARCH_PLACEHOLDER, type InventoryToolbarFilters } from "./toolbarProps";

const MobileToolbar = (props: InventoryToolbarFilters & { resultCount: number }) => {
  const palette = useInventoryPalette();

  return (
    <View className="w-full gap-3">
      <SearchField
        value={props.search}
        onChangeText={props.onSearchChange}
        placeholder={SEARCH_PLACEHOLDER}
        accessibilityLabel="Search inventory"
      />

      <View className="w-full flex-row flex-wrap gap-2">
        <SelectMenu
          label="Filter by category"
          value={props.category}
          options={CATEGORY_FILTER_OPTIONS}
          onChange={props.onCategoryChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 1, minWidth: 138 }}
        />
        <SelectMenu
          label="Filter by stock status"
          value={props.stockStatus}
          options={STOCK_STATUS_FILTER_OPTIONS}
          onChange={props.onStockStatusChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 1, minWidth: 158 }}
        />
        <SelectMenu
          label="Filter by expiry status"
          value={props.expiryStatus}
          options={EXPIRY_STATUS_FILTER_OPTIONS}
          onChange={props.onExpiryStatusChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 1, minWidth: 162 }}
        />
        <SelectMenu
          label="Sort inventory"
          value={props.sort}
          options={SORT_OPTIONS}
          onChange={props.onSortChange}
          icon="swap-vertical"
          height={CONTROL_HEIGHT}
          style={{ flex: 1.3, minWidth: 186 }}
        />
      </View>

      <View className="w-full flex-row items-center justify-between gap-3">
        <Text className="text-[15px] font-semibold" style={{ color: palette.heading }}>
          {props.resultCount.toLocaleString()} {props.resultCount === 1 ? "item" : "items"}
        </Text>
        {props.canAddItem ? <AddItemButton onPress={props.onAddItem} /> : null}
      </View>
    </View>
  );
};

export default MobileToolbar;
