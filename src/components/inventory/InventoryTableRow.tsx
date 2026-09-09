import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Checkbox from "@/components/users/Checkbox";
import { resolveDisplayStatus, type InventoryItem } from "@/services/inventoryService";
import CategoryBadge from "./CategoryBadge";
import StockStatusBadge from "./StockStatusBadge";
import { INVENTORY_COLUMNS } from "./inventoryFilters";
import { CATEGORY_ICONS, formatShortDate, useInventoryPalette } from "./inventoryTheme";

type InventoryTableRowProps = {
  item: InventoryItem;
  isSelected: boolean;
  isChecked: boolean;
  onToggleCheck: (next: boolean) => void;
  onSelect: () => void;
  /** The last row drops its divider so it cannot double up with the card edge. */
  isLast: boolean;
};

function Cell({
  children,
  flex,
  width,
  align = "flex-start",
}: {
  children: React.ReactNode;
  flex?: number;
  width?: number;
  align?: "flex-start" | "center";
}) {
  return (
    <View
      className="justify-center px-2.5"
      style={{ flex, width, minWidth: 0, alignItems: align === "center" ? "center" : undefined }}
    >
      {children}
    </View>
  );
}

export default function InventoryTableRow({
  item,
  isSelected,
  isChecked,
  onToggleCheck,
  onSelect,
  isLast,
}: InventoryTableRowProps) {
  const palette = useInventoryPalette();
  const [hovered, setHovered] = useState(false);

  const status = resolveDisplayStatus(item);
  const tone = palette.categories[item.category] ?? palette.categories.other;

  const background = isSelected
    ? palette.rowSelected
    : hovered
      ? palette.subtleSurface
      : palette.cardBg;

  // A date that has passed, or is inside the urgent window, is called out in
  // red — the same fact the Status badge carries, so colour is never the only
  // signal, but it is what makes the column scannable.
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

      {/* Item — icon, name, and the dosage or packaging underneath. */}
      <Cell flex={INVENTORY_COLUMNS.item}>
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
            <Text
              className="text-[14px] font-bold"
              numberOfLines={1}
              style={{ color: palette.heading }}
            >
              {item.name}
            </Text>
            {item.specification ? (
              <Text className="mt-0.5 text-[12px]" numberOfLines={1} style={{ color: palette.muted }}>
                {item.specification}
              </Text>
            ) : null}
          </View>
        </View>
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
}
