import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { QUEUE_RADIUS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { InventoryItem } from "@/features/inventory/services/inventoryService";
import type { MedicalField } from "@/services/medicalRecords";
import InventoryPickerSheet from "../dispensing/InventoryPickerSheet";

export type VaccinePick = {
  item: InventoryItem;
  vaccineName: string;
  batchNumber: string;
  expiryDate: string;
};

const toDateKey = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const readPick = (item: InventoryItem): VaccinePick => {
  return {
    item,
    vaccineName: item.name,
    batchNumber: item.batchNumber ?? "",
    expiryDate: toDateKey(item.nearestExpiry),
  };
};

const VaccineField = ({
  field,
  value,
  error,
  disabled,
  linkedItem,
  onPick,
  onClear,
}: {
  field: MedicalField;
  value: string;
  error?: string;
  disabled?: boolean;
  linkedItem: InventoryItem | null;
  onPick: (pick: VaccinePick) => void;
  onClear: () => void;
}) => {
  const palette = useQueuePalette();
  const [pickerOpen, setPickerOpen] = useState(false);

  const filled = Boolean(value);
  const helper = error ?? field.helper;

  return (
    <View className="w-full">
      <View className="mb-1.5 flex-row items-center gap-1">
        <Text className="text-[13px] font-semibold" style={{ color: palette.body }}>
          {field.label}
        </Text>
        {field.required ? (
          <Text className="text-[13px] font-semibold" style={{ color: "#DC2626" }}>
            *
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={() => !disabled && setPickerOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={
          filled ? `${field.label}: ${value}. Choose a different vaccine.` : `Choose a vaccine from inventory`
        }
        className="h-11 flex-row items-center gap-2.5 px-3"
        style={{
          borderRadius: QUEUE_RADIUS.control,
          borderWidth: 1,
          borderColor: error ? "#DC2626" : filled ? palette.primary : palette.panelBorder,
          backgroundColor: palette.isDark ? "#0B1220" : "#FFFFFF",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Feather name={filled ? "shield" : "search"} size={16} color={filled ? palette.primary : palette.subtle} />
        <Text
          numberOfLines={1}
          className="min-w-0 flex-1 text-[14px]"
          style={{ color: filled ? palette.heading : palette.subtle, fontWeight: filled ? "600" : "400" }}
        >
          {filled ? value : "Choose a vaccine from inventory"}
        </Text>
        <Feather name="chevron-down" size={16} color={palette.muted} />
      </Pressable>

      {linkedItem ? (
        <View className="mt-1.5 flex-row items-center gap-2">
          <Feather name="link" size={11} color={palette.primary} />
          <Text className="min-w-0 flex-1 text-[11.5px]" style={{ color: palette.muted }}>
            Linked to inventory · one {linkedItem.unit} will be deducted on completion.
          </Text>
          <Pressable
            onPress={() => !disabled && onClear()}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Unlink this vaccine from inventory"
            hitSlop={10}
          >
            <Text className="text-[11.5px] font-semibold" style={{ color: palette.primary }}>
              Unlink
            </Text>
          </Pressable>
        </View>
      ) : helper ? (
        <Text className="mt-1 text-[11.5px]" style={{ color: error ? "#DC2626" : palette.subtle }}>
          {helper}
        </Text>
      ) : null}

      <InventoryPickerSheet
        visible={pickerOpen}
        selectedIds={new Set<string>()}
        category="vaccine"
        title="Choose vaccine"
        searchPlaceholder="Search vaccines..."
        onPick={(item) => {
          onPick(readPick(item));
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
};

export default VaccineField;
