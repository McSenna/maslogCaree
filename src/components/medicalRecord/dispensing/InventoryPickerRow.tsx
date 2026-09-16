import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { QUEUE_RADIUS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import StockStatusBadge from "@/features/inventory/components/StockStatusBadge";
import {
  resolveStatusBadges,
  type InventoryItem,
} from "@/features/inventory/services/inventoryService";

export const blockedReason = (item: InventoryItem): string | null => {
  if (item.expiryStatus === "expired") return "Expired";
  if (item.currentStock <= 0) return "Out of stock";
  return null;
};

const InventoryPickerRow = ({
  item,
  selected,
  onPick,
}: {
  item: InventoryItem;
  selected: boolean;
  onPick: (item: InventoryItem) => void;
}) => {
  const palette = useQueuePalette();
  const blocked = blockedReason(item);

  const subtitle = [item.category, item.specification].filter(Boolean).join(" · ");

  const expiry = item.nearestExpiry
    ? new Date(item.nearestExpiry).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Pressable
      onPress={() => !blocked && onPick(item)}
      disabled={Boolean(blocked)}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(blocked), selected }}
      accessibilityLabel={
        blocked
          ? `${item.name}, ${blocked}, cannot be selected`
          : `${item.name}, ${item.currentStock} ${item.unit} available${selected ? ", already added" : ""}`
      }
      className="w-full flex-row items-center gap-3 px-3 py-3"
      style={{
        borderRadius: QUEUE_RADIUS.control,
        backgroundColor: selected ? palette.primarySoft : "transparent",
        opacity: blocked ? 0.55 : 1,
      }}
    >
      <View className="min-w-0 flex-1 gap-1">
        <Text numberOfLines={1} className="text-[14px] font-semibold" style={{ color: palette.heading }}>
          {item.name}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} className="text-[12px] capitalize" style={{ color: palette.muted }}>
            {subtitle}
          </Text>
        ) : null}
        <View className="flex-row flex-wrap items-center gap-1.5 pt-0.5">
          {resolveStatusBadges(item).map((status) => (
            <StockStatusBadge key={status} status={status} compact />
          ))}
          <Text className="text-[12px] font-medium" style={{ color: palette.body }}>
            {blocked === "Expired"
              ? "Cannot be dispensed"
              : `Available: ${item.currentStock} ${item.unit}`}
          </Text>
          {expiry ? (
            <Text className="text-[12px]" style={{ color: palette.muted }}>
              Exp. {expiry}
            </Text>
          ) : null}
        </View>
      </View>

      {selected ? (
        <Feather name="check-circle" size={18} color={palette.primary} />
      ) : blocked ? (
        <Feather name="slash" size={16} color={palette.subtle} />
      ) : (
        <Feather name="plus-circle" size={18} color={palette.primary} />
      )}
    </Pressable>
  );
};

export default InventoryPickerRow;
