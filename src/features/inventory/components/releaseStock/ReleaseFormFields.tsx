import { Text, View } from "react-native";
import type { SelectOption } from "@/components/ui/SelectMenu";
import type { InventoryItem } from "@/features/inventory/services/inventoryService";
import { formatDate } from "@/utils/dateFormatter";
import { Field, ReadOnlyValue, SelectField, TextField } from "../InventoryFormModal";
import { RADIUS, useInventoryPalette } from "../inventoryTheme";
import type { ReleaseType, useReleaseStockForm } from "./useReleaseStockForm";

const RELEASE_TYPE_OPTIONS: readonly SelectOption<ReleaseType>[] = [
  { value: "STOCK_OUT", label: "Dispensed / Released" },
  { value: "TRANSFER", label: "Transferred" },
  { value: "DAMAGED", label: "Damaged" },
  { value: "EXPIRED", label: "Expired — disposal" },
  { value: "ADJUSTMENT", label: "Adjustment" },
];

const ReleaseFormFields = ({
  item,
  releasedByName,
  form,
}: {
  item: InventoryItem;
  releasedByName: string;
  form: ReturnType<typeof useReleaseStockForm>;
}) => {
  const palette = useInventoryPalette();

  const nextBatchLine = item.batchNumber
    ? `Stock will be drawn from batch ${item.batchNumber}${
        item.nearestExpiry ? `, expiring ${formatDate(item.nearestExpiry)}` : ""
      } — the earliest expiry first (FEFO).`
    : "Stock will be drawn from the batch with the earliest expiry date (FEFO).";

  return (
    <>
      <Field label="Item">
        <ReadOnlyValue value={`${item.name}${item.specification ? ` — ${item.specification}` : ""}`} />
      </Field>

      <View className="flex-row gap-3">
        <View className="min-w-0 flex-1">
          <Field label="Available Stock">
            <ReadOnlyValue value={`${form.available.toLocaleString()} ${item.unit}`} />
          </Field>
        </View>
        <View className="min-w-0 flex-1">
          <Field label="Quantity to Release" required error={form.quantityError}>
            <TextField
              value={form.quantity}
              onChangeText={(next) => form.setQuantity(next.replace(/[^0-9]/g, ""))}
              placeholder="e.g. 20"
              accessibilityLabel="Quantity to release"
              keyboardType="number-pad"
            />
          </Field>
        </View>
      </View>

      <View
        className="border p-3"
        style={{
          borderRadius: RADIUS.control,
          backgroundColor: palette.bannerBg,
          borderColor: palette.bannerBorder,
        }}
      >
        <Text className="text-[12px] font-medium leading-[17px]" style={{ color: palette.body }}>
          {nextBatchLine}
        </Text>
      </View>

      <Field label="Release Type">
        <SelectField label="Release type" value={form.type} options={RELEASE_TYPE_OPTIONS} onChange={form.setType} />
      </Field>

      <Field label="Reason" required>
        <TextField
          value={form.reason}
          onChangeText={form.setReason}
          placeholder="e.g. Dispensed to patient"
          accessibilityLabel="Reason for release"
          maxLength={300}
        />
      </Field>

      <Field label="Released To / Department">
        <TextField
          value={form.recipient}
          onChangeText={form.setRecipient}
          placeholder="e.g. Maternal Health Unit"
          accessibilityLabel="Released to"
          maxLength={200}
        />
      </Field>

      <Field label="Released By">
        <ReadOnlyValue value={releasedByName} />
      </Field>

      <Field label="Remarks">
        <TextField
          value={form.remarks}
          onChangeText={form.setRemarks}
          placeholder="Optional notes about this release"
          accessibilityLabel="Remarks"
          multiline
          maxLength={500}
        />
      </Field>
    </>
  );
};

export default ReleaseFormFields;
