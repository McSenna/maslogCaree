import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { TableLink, TableText, type Column } from "@/components/data-table";
import { TABLE_TEXT } from "@/components/data-table/tableTokens";
import Checkbox from "@/components/ui/Checkbox";
import { resolveDisplayStatus, type InventoryItem } from "@/features/inventory/services/inventoryService";
import { formatTableDate } from "@/utils/dateFormatter";

import CategoryBadge from "./CategoryBadge";
import { CATEGORY_ICONS, useInventoryPalette } from "./inventoryTheme";
import StockStatusBadge from "./StockStatusBadge";

type Handlers = {
  checkedIds: ReadonlySet<string>;
  allChecked: boolean;
  someChecked: boolean;
  onToggleItem: (itemId: string, next: boolean) => void;
  onToggleAll: (next: boolean) => void;
  onOpen: (item: InventoryItem) => void;
};

const ItemIdentity = ({ item, onOpen }: { item: InventoryItem; onOpen: (item: InventoryItem) => void }) => {
  const palette = useInventoryPalette();
  const tone = palette.categories[item.category] ?? palette.categories.other;
  return (
    <View className="min-w-0 flex-row items-center gap-3 self-stretch">
      <View className="h-8 w-8 shrink-0 items-center justify-center rounded-sm" style={{ backgroundColor: tone.bg }}>
        <MaterialCommunityIcons name={CATEGORY_ICONS[item.category] ?? "package-variant-closed"} size={16} color={tone.text} />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <TableLink label={item.name} accessibilityLabel={`View details for ${item.name}`} onPress={() => onOpen(item)} />
        {item.specification ? (
          <Text numberOfLines={1} style={[TABLE_TEXT.secondary, { color: palette.muted }]}>
            {item.specification}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const urgentExpiry = (item: InventoryItem) => item.expiryStatus === "expired" || item.expiryStatus === "urgent";

/** Inventory items, declared once for the header, rows, skeleton and phone cards. */
export const inventoryColumns = ({ checkedIds, allChecked, someChecked, onToggleItem, onToggleAll, onOpen }: Handlers): Column<InventoryItem>[] => [
  {
    key: "select",
    header: "Select",
    width: 52,
    cardRole: "hidden",
    renderHeader: () => (
      <Checkbox checked={allChecked} indeterminate={someChecked} onChange={onToggleAll} accessibilityLabel="Select all inventory items on this page" />
    ),
    render: (item) => (
      <Checkbox checked={checkedIds.has(item._id)} onChange={(next) => onToggleItem(item._id, next)} accessibilityLabel={`Select ${item.name}`} />
    ),
  },
  { key: "item", header: "Item", flex: 2.6, minWidth: 220, render: (item) => <ItemIdentity item={item} onOpen={onOpen} /> },
  { key: "category", header: "Category", width: 150, cardRole: "badge", render: (item) => <CategoryBadge category={item.category} /> },
  { key: "batch", header: "Batch or lot no.", flex: 1, minWidth: 130, hideBelow: "lg", accessor: (item) => item.batchNumber || "Not set" },
  {
    key: "stock",
    header: "Stock",
    width: 90,
    align: "right",
    render: (item) => <TableText value={item.currentStock.toLocaleString()} weight="strong" tone="heading" align="right" />,
  },
  { key: "unit", header: "Unit", width: 90, hideBelow: "md", render: (item) => <TableText value={item.unit} tone="muted" /> },
  {
    key: "reorderLevel",
    header: "Reorder level",
    width: 120,
    align: "right",
    hideBelow: "lg",
    accessor: (item) => item.reorderLevel.toLocaleString(),
  },
  {
    key: "expiry",
    header: "Expiry date",
    width: 130,
    render: (item) => <TableText value={formatTableDate(item.nearestExpiry, "Not set")} tone={urgentExpiry(item) ? "danger" : "body"} />,
  },
  // Wide enough for "Expiring Soon", the longest stock status.
  { key: "status", header: "Status", width: 170, cardRole: "badge", render: (item) => <StockStatusBadge status={resolveDisplayStatus(item)} compact /> },
];
