import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import type { InventoryItem, InventoryPermissions } from "@/services/inventoryService";
import InventoryActions, { type InventoryActionHandlers } from "./InventoryActions";
import InventoryDetailRow from "./InventoryDetailRow";
import InventoryItemSummary from "./InventoryItemSummary";
import InventoryWarning from "./InventoryWarning";
import { buildDetailFields } from "./inventoryDetailFields";
import { CARD_SHADOW, RADIUS, useInventoryPalette } from "./inventoryTheme";

type InventoryDetailsPanelProps = {
  item: InventoryItem | null;
  permissions: InventoryPermissions;
  loading?: boolean;
  onClose: () => void;
  handlers: InventoryActionHandlers;
};

/**
 * Inventory Item Details — the desktop presentation.
 *
 * A column beside the table, as the design specifies: the row and its details
 * are read together when deciding whether to restock, so the panel does not
 * cover the row it describes.
 *
 * Every part of the body — summary, alerts, fields, actions — is the same
 * component the phone's bottom sheet uses, so the two presentations cannot
 * drift in content, ordering or permission handling. Only the chrome differs.
 */
export default function InventoryDetailsPanel({
  item,
  permissions,
  loading = false,
  onClose,
  handlers,
}: InventoryDetailsPanelProps) {
  const palette = useInventoryPalette();

  const surface = {
    borderRadius: RADIUS.card,
    backgroundColor: palette.cardBg,
    borderColor: palette.cardBorder,
    borderWidth: 1,
    ...CARD_SHADOW,
  };

  if (!item) {
    return (
      <View className="w-full overflow-hidden" style={surface}>
        <View className="items-center gap-3 px-6 py-14">
          <View
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: palette.divider }}
          >
            <Feather name="package" size={20} color={palette.subtle} />
          </View>
          <Text className="text-center text-[14px] font-semibold" style={{ color: palette.heading }}>
            No item selected
          </Text>
          <Text className="text-center text-[12.5px]" style={{ color: palette.muted }}>
            Select an inventory item to see its batch, expiry and stock details.
          </Text>
        </View>
      </View>
    );
  }

  const fields = buildDetailFields(item);

  return (
    <View className="w-full overflow-hidden" style={surface}>
      <View
        className="flex-row items-center justify-between px-4 py-3"
        style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
      >
        <Text accessibilityRole="header" className="text-[15px] font-bold" style={{ color: palette.heading }}>
          Inventory Item Details
        </Text>
        <View className="flex-row items-center gap-2">
          {loading ? <ActivityIndicator size="small" color={palette.primary} /> : null}
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close inventory item details"
            hitSlop={12}
            className="h-7 w-7 items-center justify-center rounded-full"
          >
            <Feather name="x" size={16} color={palette.muted} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 14, gap: 12 }}>
        <InventoryItemSummary item={item} size="sm" />

        <InventoryWarning item={item} />

        <View className="w-full">
          {fields.map((field) => (
            <InventoryDetailRow
              key={field.key}
              icon={field.icon}
              label={field.label}
              value={field.value}
              emphasis={field.emphasis}
            />
          ))}
        </View>

        <InventoryActions item={item} permissions={permissions} handlers={handlers} />
      </ScrollView>
    </View>
  );
}
