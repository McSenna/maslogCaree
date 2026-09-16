import { View } from "react-native";
import SearchField from "@/components/ui/SearchField";
import SelectMenu from "@/components/ui/SelectMenu";
import {
  CATEGORY_FILTER_OPTIONS,
  EXPIRY_STATUS_FILTER_OPTIONS,
  SORT_OPTIONS,
  STOCK_STATUS_FILTER_OPTIONS,
} from "../inventoryFilters";
import { CONTROL_HEIGHT } from "../inventoryTheme";
import AddItemButton from "./AddItemButton";
import { SEARCH_PLACEHOLDER, type InventoryToolbarFilters } from "./toolbarProps";

const DesktopToolbar = (props: InventoryToolbarFilters) => (
  <View className="w-full flex-row flex-wrap items-center gap-3">
    <SearchField
      value={props.search}
      onChangeText={props.onSearchChange}
      placeholder={SEARCH_PLACEHOLDER}
      accessibilityLabel="Search inventory"
      style={{ flex: 34, minWidth: 260 }}
    />
    <SelectMenu
      label="Filter by category"
      value={props.category}
      options={CATEGORY_FILTER_OPTIONS}
      onChange={props.onCategoryChange}
      height={CONTROL_HEIGHT}
      style={{ flex: 14, minWidth: 152 }}
    />
    <SelectMenu
      label="Filter by stock status"
      value={props.stockStatus}
      options={STOCK_STATUS_FILTER_OPTIONS}
      onChange={props.onStockStatusChange}
      height={CONTROL_HEIGHT}
      style={{ flex: 14, minWidth: 172 }}
    />
    <SelectMenu
      label="Filter by expiry status"
      value={props.expiryStatus}
      options={EXPIRY_STATUS_FILTER_OPTIONS}
      onChange={props.onExpiryStatusChange}
      height={CONTROL_HEIGHT}
      style={{ flex: 14, minWidth: 176 }}
    />
    <SelectMenu
      label="Sort inventory"
      value={props.sort}
      options={SORT_OPTIONS}
      onChange={props.onSortChange}
      icon="swap-vertical"
      height={CONTROL_HEIGHT}
      style={{ flex: 17, minWidth: 205 }}
    />
    {props.canAddItem ? <AddItemButton onPress={props.onAddItem} /> : null}
  </View>
);

export default DesktopToolbar;
