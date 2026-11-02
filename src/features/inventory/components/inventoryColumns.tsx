import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { TableCellRow, TableLink, TableText, type Column } from "@/components/data-table";
import { TABLE_TEXT } from "@/components/data-table/tableTokens";
import { resolveDisplayStatus, type InventoryItem } from "@/features/inventory/services/inventoryService";
import { formatTableDate } from "@/utils/dateFormatter";

import CategoryBadge from "./CategoryBadge";
import { CATEGORY_ICONS, useInventoryPalette } from "./inventoryTheme";
import StockStatusBadge from "./StockStatusBadge";

type Handlers = {
  onOpen: (item: InventoryItem) => void;
};

const ItemIdentity = ({ item, onOpen }: { item: InventoryItem; onOpen: (item: InventoryItem) => void }) => {
  const palette = useInventoryPalette();
  const tone = palette.categories[item.category] ?? palette.categories.other;
  return (
    <TableCellRow className="gap-3">
      <View className="h-8 w-8 shrink-0 items-center justify-center rounded-sm" style={{ backgroundColor: tone.bg }}>
        <MaterialCommunityIcons name={CATEGORY_ICONS[item.category] ?? "package-variant-closed"} size={16} color={tone.text} />
      </View>
      <View className="min-w-0 shrink gap-0.5">
        <TableLink label={item.name} accessibilityLabel={`View details for ${item.name}`} onPress={() => onOpen(item)} />
        {item.specification ? (
          <Text numberOfLines={1} style={[TABLE_TEXT.secondary, { color: palette.muted }]}>
            {item.specification}
          </Text>
        ) : null}
      </View>
    </TableCellRow>
  );
};

const urgentExpiry = (item: InventoryItem) => item.expiryStatus === "expired" || item.expiryStatus === "urgent";

/** Inventory items, declared once for the header, rows, skeleton and phone cards. */
export const inventoryColumns = ({ onOpen }: Handlers): Column<InventoryItem>[] => [
  { key: "item", nameColumn: true, header: "Item", flex: 2.6, minWidth: 250, render: (item) => <ItemIdentity item={item} onOpen={onOpen} /> },
  { key: "category", header: "Category", align: "center", width: 150, cardRole: "badge", render: (item) => <CategoryBadge category={item.category} /> },
  { key: "batch", header: "Batch or lot no.", align: "center", flex: 1, minWidth: 130, hideBelow: "lg", accessor: (item) => item.batchNumber || "Not set" },
  {
    key: "stock",
    header: "Stock",
    width: 98,
    align: "right",
    render: (item) => <TableText value={item.currentStock.toLocaleString()} weight="strong" tone="heading" />,
  },
  { key: "unit", header: "Unit", align: "center", width: 98, hideBelow: "md", render: (item) => <TableText value={item.unit} tone="muted" /> },
  {
    key: "reorderLevel",
    header: "Reorder level",
    width: 134,
    align: "right",
    hideBelow: "lg",
    accessor: (item) => item.reorderLevel.toLocaleString(),
  },
  {
    key: "expiry",
    header: "Expiry date",
    align: "center",
    width: 136,
    render: (item) => <TableText value={formatTableDate(item.nearestExpiry, "Not set")} tone={urgentExpiry(item) ? "danger" : "body"} />,
  },
  // Wide enough for "Expiring Soon", the longest stock status.
  { key: "status", header: "Status", align: "center", width: 176, cardRole: "badge", render: (item) => <StockStatusBadge status={resolveDisplayStatus(item)} compact /> },
];
