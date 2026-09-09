import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import SearchField from "@/components/users/SearchField";
import SelectMenu from "@/components/users/SelectMenu";
import type { InventorySortKey } from "@/services/inventoryService";
import {
  CATEGORY_FILTER_OPTIONS,
  EXPIRY_STATUS_FILTER_OPTIONS,
  SORT_OPTIONS,
  STOCK_STATUS_FILTER_OPTIONS,
  type CategoryFilter,
  type ExpiryStatusFilter,
  type StockStatusFilter,
} from "./inventoryFilters";
import { CONTROL_HEIGHT, RADIUS, useInventoryPalette } from "./inventoryTheme";

const SEARCH_PLACEHOLDER = "Search medicines, vaccines, supplies, equipment...";

type InventoryToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  stockStatus: StockStatusFilter;
  onStockStatusChange: (value: StockStatusFilter) => void;
  expiryStatus: ExpiryStatusFilter;
  onExpiryStatusChange: (value: ExpiryStatusFilter) => void;
  sort: InventorySortKey;
  onSortChange: (value: InventorySortKey) => void;
  onAddItem: () => void;
  /** Hidden for roles the server would refuse the create call from. */
  canAddItem: boolean;
  /** Desktop puts every control on one row; mobile stacks search / filters / action. */
  isDesktop: boolean;
  /** Mobile only — the count that sits opposite the Add Item button. */
  resultCount?: number;
};

function AddItemButton({ onPress }: { onPress: () => void }) {
  const palette = useInventoryPalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add inventory item"
      // Press feedback rides on the class, not a style callback: react-native-web
      // drops a function-form `style` on Pressable, taking the fill with it.
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
  );
}

export default function InventoryToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  stockStatus,
  onStockStatusChange,
  expiryStatus,
  onExpiryStatusChange,
  sort,
  onSortChange,
  onAddItem,
  canAddItem,
  isDesktop,
  resultCount = 0,
}: InventoryToolbarProps) {
  const palette = useInventoryPalette();

  if (isDesktop) {
    // One row wherever it fits — the design's layout on a wide screen — with the
    // search field taking the slack. Four menus plus the button need more width
    // than three did on the other admin pages, so the row wraps rather than
    // squeezing the search box down to a few characters at 1280px. Every
    // minimum below is what that control needs to show its label in full.
    return (
      <View className="w-full flex-row flex-wrap items-center gap-3">
        <SearchField
          value={search}
          onChangeText={onSearchChange}
          placeholder={SEARCH_PLACEHOLDER}
          accessibilityLabel="Search inventory"
          style={{ flex: 34, minWidth: 260 }}
        />
        <SelectMenu
          label="Filter by category"
          value={category}
          options={CATEGORY_FILTER_OPTIONS}
          onChange={onCategoryChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 14, minWidth: 152 }}
        />
        <SelectMenu
          label="Filter by stock status"
          value={stockStatus}
          options={STOCK_STATUS_FILTER_OPTIONS}
          onChange={onStockStatusChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 14, minWidth: 172 }}
        />
        <SelectMenu
          label="Filter by expiry status"
          value={expiryStatus}
          options={EXPIRY_STATUS_FILTER_OPTIONS}
          onChange={onExpiryStatusChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 14, minWidth: 176 }}
        />
        <SelectMenu
          label="Sort inventory"
          value={sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
          icon="swap-vertical"
          height={CONTROL_HEIGHT}
          style={{ flex: 17, minWidth: 205 }}
        />
        {canAddItem ? <AddItemButton onPress={onAddItem} /> : null}
      </View>
    );
  }

  return (
    <View className="w-full gap-3">
      <SearchField
        value={search}
        onChangeText={onSearchChange}
        placeholder={SEARCH_PLACEHOLDER}
        accessibilityLabel="Search inventory"
      />

      {/* One row wherever the menus fit — a wide phone, a tablet — wrapping only
          when keeping them inline would clip a label. The minimum widths are
          what each label needs in full, so nothing is truncated. */}
      <View className="w-full flex-row flex-wrap gap-2">
        <SelectMenu
          label="Filter by category"
          value={category}
          options={CATEGORY_FILTER_OPTIONS}
          onChange={onCategoryChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 1, minWidth: 138 }}
        />
        <SelectMenu
          label="Filter by stock status"
          value={stockStatus}
          options={STOCK_STATUS_FILTER_OPTIONS}
          onChange={onStockStatusChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 1, minWidth: 158 }}
        />
        <SelectMenu
          label="Filter by expiry status"
          value={expiryStatus}
          options={EXPIRY_STATUS_FILTER_OPTIONS}
          onChange={onExpiryStatusChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 1, minWidth: 162 }}
        />
        <SelectMenu
          label="Sort inventory"
          value={sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
          icon="swap-vertical"
          height={CONTROL_HEIGHT}
          style={{ flex: 1.3, minWidth: 186 }}
        />
      </View>

      <View className="w-full flex-row items-center justify-between gap-3">
        <Text className="text-[15px] font-semibold" style={{ color: palette.heading }}>
          {resultCount.toLocaleString()} {resultCount === 1 ? "item" : "items"}
        </Text>
        {canAddItem ? <AddItemButton onPress={onAddItem} /> : null}
      </View>
    </View>
  );
}
