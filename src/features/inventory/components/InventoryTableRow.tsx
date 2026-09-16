import { useState } from "react";
import { Pressable, Text } from "react-native";
import Checkbox from "@/components/ui/Checkbox";
import { resolveDisplayStatus, type InventoryItem } from "@/features/inventory/services/inventoryService";
import CategoryBadge from "./CategoryBadge";
import StockStatusBadge from "./StockStatusBadge";
import Cell from "./tableRow/Cell";
import ItemIdentityCell from "./tableRow/ItemIdentityCell";
import { INVENTORY_COLUMNS } from "./inventoryFilters";
import { formatShortDate, useInventoryPalette } from "./inventoryTheme";

type InventoryTableRowProps = {
  item: InventoryItem;
  isSelected: boolean;
  isChecked: boolean;
  onToggleCheck: (next: boolean) => void;
  onSelect: () => void;
  isLast: boolean;
};

const InventoryTableRow = ({
  item,
  isSelected,
  isChecked,
  onToggleCheck,
  onSelect,
  isLast,
}: InventoryTableRowProps) => {
  const palette = useInventoryPalette();
  const [hovered, setHovered] = useState(false);

  const status = resolveDisplayStatus(item);

  const background = isSelected
    ? palette.rowSelected
    : hovered
      ? palette.subtleSurface
      : palette.cardBg;

  const expiryUrgent = item.expiryStatus === "expired" || item.expiryStatus === "urgent";

  return (
    <Pressable
      onPress={onSelect}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${item.name}`}
      accessibilityState={{ selected: isSelected }}
      className="w-full flex-row items-center"
      style={{
        minHeight: 68,
        backgroundColor: background,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <Cell width={INVENTORY_COLUMNS.checkbox} align="center">
        <Checkbox
          checked={isChecked}
          onChange={onToggleCheck}
          accessibilityLabel={`Select ${item.name}`}
        />
      </Cell>

      <Cell flex={INVENTORY_COLUMNS.item}>
        <ItemIdentityCell item={item} />
      </Cell>

      <Cell flex={INVENTORY_COLUMNS.category}>
        <CategoryBadge category={item.category} />
      </Cell>

      <Cell flex={INVENTORY_COLUMNS.batch}>
        <Text className="text-[13px] font-medium" numberOfLines={1} style={{ color: palette.body }}>
          {item.batchNumber || "—"}
        </Text>
      </Cell>

      <Cell flex={INVENTORY_COLUMNS.stock}>
        <Text className="text-[13px] font-semibold" style={{ color: palette.heading }}>
          {item.currentStock.toLocaleString()}
        </Text>
      </Cell>

      <Cell flex={INVENTORY_COLUMNS.unit}>
        <Text className="text-[13px] font-medium" numberOfLines={1} style={{ color: palette.muted }}>
          {item.unit}
        </Text>
      </Cell>

      <Cell flex={INVENTORY_COLUMNS.reorderLevel}>
        <Text className="text-[13px] font-medium" style={{ color: palette.body }}>
          {item.reorderLevel.toLocaleString()}
        </Text>
      </Cell>

      <Cell flex={INVENTORY_COLUMNS.expiry}>
        <Text
          className="text-[13px] font-medium"
          numberOfLines={1}
          style={{ color: expiryUrgent ? palette.danger : palette.body }}
        >
          {formatShortDate(item.nearestExpiry)}
        </Text>
      </Cell>

      <Cell flex={INVENTORY_COLUMNS.status}>
        <StockStatusBadge status={status} compact />
      </Cell>
    </Pressable>
  );
};

export default InventoryTableRow;
