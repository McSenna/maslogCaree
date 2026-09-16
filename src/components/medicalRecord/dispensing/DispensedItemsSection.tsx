import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { QUEUE_RADIUS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { InventoryItem } from "@/features/inventory/services/inventoryService";
import DispensedItemRow from "./DispensedItemRow";
import InventoryPickerSheet from "./InventoryPickerSheet";
import type { DispensedLine } from "./useDispensedItems";

const DispensedItemsSection = ({
  lines,
  selectedIds,
  onAdd,
  onChangeQuantity,
  onRemove,
  disabled = false,
}: {
  lines: DispensedLine[];
  selectedIds: Set<string>;
  onAdd: (item: InventoryItem) => void;
  onChangeQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  disabled?: boolean;
}) => {
  const palette = useQueuePalette();
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <View className="w-full gap-3">
      {lines.length === 0 ? (
        <View
          className="w-full items-center gap-1.5 px-4 py-5"
          style={{
            borderRadius: QUEUE_RADIUS.control,
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: palette.panelBorder,
            backgroundColor: palette.rowHover,
          }}
        >
          <Text className="text-center text-[13px] font-semibold" style={{ color: palette.body }}>
            No medicines or supplies added.
          </Text>
          <Text className="text-center text-[12px] leading-[17px]" style={{ color: palette.muted }}>
            Medicines and healthcare supplies given to the patient can be recorded here.
          </Text>
        </View>
      ) : (
        <View className="w-full gap-2.5">
          {lines.map((line) => (
            <DispensedItemRow
              key={line.item._id}
              line={line}
              onChangeQuantity={(quantity) => onChangeQuantity(line.item._id, quantity)}
              onRemove={() => onRemove(line.item._id)}
              disabled={disabled}
            />
          ))}
        </View>
      )}

      <Pressable
        onPress={() => setPickerOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Add an inventory item given to this patient"
        className="h-11 w-full flex-row items-center justify-center gap-2"
        style={{
          borderRadius: QUEUE_RADIUS.control,
          borderWidth: 1,
          borderColor: palette.primary,
          backgroundColor: palette.primarySoft,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Feather name="plus" size={16} color={palette.primary} />
        <Text className="text-[13.5px] font-semibold" style={{ color: palette.primary }}>
          Add Inventory Item
        </Text>
      </Pressable>

      <InventoryPickerSheet
        visible={pickerOpen}
        selectedIds={selectedIds}
        onPick={(item) => {
          onAdd(item);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
};

export default DispensedItemsSection;
