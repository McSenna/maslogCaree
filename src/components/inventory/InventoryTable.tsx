import { Text, View } from "react-native";
import Checkbox from "@/components/users/Checkbox";
import type { InventoryItem } from "@/services/inventoryService";
import InventoryTableRow from "./InventoryTableRow";
import { INVENTORY_COLUMNS } from "./inventoryFilters";
import { useInventoryPalette } from "./inventoryTheme";

const HEADERS: { label: string; flex: number }[] = [
  { label: "Item", flex: INVENTORY_COLUMNS.item },
  { label: "Category", flex: INVENTORY_COLUMNS.category },
  { label: "Batch / Lot No.", flex: INVENTORY_COLUMNS.batch },
  { label: "Stock", flex: INVENTORY_COLUMNS.stock },
  { label: "Unit", flex: INVENTORY_COLUMNS.unit },
  { label: "Reorder Level", flex: INVENTORY_COLUMNS.reorderLevel },
  { label: "Expiry Date", flex: INVENTORY_COLUMNS.expiry },
  { label: "Status", flex: INVENTORY_COLUMNS.status },
];

type InventoryTableProps = {
  items: InventoryItem[];
  selectedItemId: string | null;
  onSelectItem: (item: InventoryItem) => void;
  checkedIds: ReadonlySet<string>;
  onToggleItem: (itemId: string, next: boolean) => void;
  onToggleAll: (next: boolean) => void;
};

export default function InventoryTable({
  items,
  selectedItemId,
  onSelectItem,
  checkedIds,
  onToggleItem,
  onToggleAll,
}: InventoryTableProps) {
  const palette = useInventoryPalette();

  const checkedOnPage = items.filter((item) => checkedIds.has(item._id)).length;
  const allChecked = items.length > 0 && checkedOnPage === items.length;
  const someChecked = checkedOnPage > 0 && !allChecked;

  return (
    <View className="w-full">
      {/* Header — deliberately light: a dark strip would fight the metric cards
          for attention on a page that is mostly table. */}
      <View
        className="w-full flex-row items-center"
        style={{ height: 44, borderBottomWidth: 1, borderBottomColor: palette.divider }}
      >
        <View className="items-center justify-center px-2.5" style={{ width: INVENTORY_COLUMNS.checkbox }}>
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked}
            onChange={onToggleAll}
            accessibilityLabel="Select all inventory items on this page"
          />
        </View>

        {HEADERS.map((column) => (
          <View key={column.label} className="justify-center px-2.5" style={{ flex: column.flex, minWidth: 0 }}>
            <Text
              accessibilityRole="header"
              className="text-[12px] font-semibold"
              numberOfLines={1}
              style={{ color: palette.muted }}
            >
              {column.label}
            </Text>
          </View>
        ))}
      </View>

      {items.map((item, index) => (
        <InventoryTableRow
          key={item._id}
          item={item}
          isSelected={selectedItemId === item._id}
          isChecked={checkedIds.has(item._id)}
          onToggleCheck={(next) => onToggleItem(item._id, next)}
          onSelect={() => onSelectItem(item)}
          isLast={index === items.length - 1}
        />
      ))}
    </View>
  );
}
