import { View } from "react-native";
import type { SelectOption } from "@/components/ui/SelectMenu";
import {
  STORAGE_CONDITION_LABELS,
  type InventoryItem,
  type InventorySupplier,
  type StorageCondition,
} from "@/features/inventory/services/inventoryService";
import { Field, ReadOnlyValue, SelectField, TextField } from "../InventoryFormModal";
import type { AddStockState } from "./useAddStockState";

const STORAGE_OPTIONS: readonly SelectOption<StorageCondition>[] = (
  Object.keys(STORAGE_CONDITION_LABELS) as StorageCondition[]
).map((value) => ({ value, label: STORAGE_CONDITION_LABELS[value] }));

type Props = {
  form: AddStockState;
  item: InventoryItem;
  suppliers: InventorySupplier[];
};

const AddStockFields = ({ form, item, suppliers }: Props) => {
  const supplierOptions: readonly SelectOption<string>[] = [
    { value: "none", label: "Not recorded" },
    ...suppliers.map((entry) => ({ value: entry._id, label: entry.name })),
  ];

  return (
    <>
      <Field label="Item">
        <ReadOnlyValue
          value={`${item.name}${item.specification ? ` — ${item.specification}` : ""}`}
        />
      </Field>

      <View className="flex-row gap-3">
        <View className="min-w-0 flex-1">
          <Field
            label="Quantity"
            required
            error={
              form.quantity.trim() !== "" && !form.quantityValid
                ? "Enter a whole number above zero."
                : null
            }
          >
            <TextField
              value={form.quantity}
              onChangeText={(next) => form.setQuantity(next.replace(/[^0-9]/g, ""))}
              placeholder="e.g. 100"
              accessibilityLabel="Quantity to add"
              keyboardType="number-pad"
            />
          </Field>
        </View>
        <View className="min-w-0 flex-1">
          <Field label="Unit">
            <ReadOnlyValue value={item.unit} />
          </Field>
        </View>
      </View>

      <Field
        label="Batch / Lot No."
        required
        helper="Receiving an existing lot number tops that lot up."
      >
        <TextField
          value={form.batchNumber}
          onChangeText={form.setBatchNumber}
          placeholder="e.g. PAR2024091"
          accessibilityLabel="Batch or lot number"
          maxLength={60}
        />
      </Field>

      <Field
        label="Expiry Date"
        required={form.expiryRequired}
        error={form.expiryError}
        helper={form.expiryRequired ? null : "Leave blank for items that do not expire."}
      >
        <TextField
          value={form.expiryDate}
          onChangeText={form.setExpiryDate}
          placeholder="YYYY-MM-DD"
          accessibilityLabel="Expiry date"
        />
      </Field>

      <Field label="Supplier / Source">
        <SelectField
          label="Supplier"
          value={form.supplier}
          options={supplierOptions}
          onChange={form.setSupplier}
        />
      </Field>

      <Field label="Source Note" helper="Where this delivery came from, if not a listed supplier.">
        <TextField
          value={form.source}
          onChangeText={form.setSource}
          placeholder="e.g. DOH / City Health Office"
          accessibilityLabel="Source"
          maxLength={200}
        />
      </Field>

      <Field
        label="Date Received"
        required
        error={
          form.receivedDate !== "" && !form.receivedValid ? "Use the format YYYY-MM-DD." : null
        }
      >
        <TextField
          value={form.receivedDate}
          onChangeText={form.setReceivedDate}
          placeholder="YYYY-MM-DD"
          accessibilityLabel="Date received"
        />
      </Field>

      <Field label="Storage Condition">
        <SelectField
          label="Storage condition"
          value={form.storageCondition}
          options={STORAGE_OPTIONS}
          onChange={form.setStorageCondition}
        />
      </Field>

      <Field label="Remarks">
        <TextField
          value={form.remarks}
          onChangeText={form.setRemarks}
          placeholder="Optional notes about this delivery"
          accessibilityLabel="Remarks"
          multiline
          maxLength={500}
        />
      </Field>
    </>
  );
};

export default AddStockFields;
