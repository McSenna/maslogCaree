import { Text, View } from "react-native";

import type { InventorySupplier } from "@/features/inventory/services/inventoryService";

import { Field, SelectField, TextField } from "../InventoryFormModal";
import { RADIUS, useInventoryPalette } from "../inventoryTheme";
import { CATEGORY_OPTIONS, STORAGE_OPTIONS, supplierOptionsFor } from "./itemFormOptions";
import type { ItemFormState } from "./useItemFormState";

type Props = {
  form: ItemFormState;
  suppliers: InventorySupplier[];
  isEdit: boolean;
  currentStock?: number;
  unit?: string;
};

const ItemFormFields = ({ form, suppliers, isEdit, currentStock, unit }: Props) => {
  const palette = useInventoryPalette();

  return (
    <>
      <Field label="Item Name" required>
        <TextField
          value={form.name}
          onChangeText={form.setName}
          placeholder="e.g. Paracetamol 500mg"
          accessibilityLabel="Item name"
          maxLength={160}
        />
      </Field>

      <Field label="Specification" helper="Dosage form or packaging — shown under the item name.">
        <TextField
          value={form.specification}
          onChangeText={form.setSpecification}
          placeholder="e.g. Tablet, 0.5 mL (Adult), Box (100 pcs)"
          accessibilityLabel="Specification"
          maxLength={120}
        />
      </Field>

      <Field label="Generic Name">
        <TextField
          value={form.genericName}
          onChangeText={form.setGenericName}
          placeholder="e.g. Paracetamol"
          accessibilityLabel="Generic name"
          maxLength={160}
        />
      </Field>

      <Field label="Category" required>
        <SelectField
          label="Category"
          value={form.category}
          options={CATEGORY_OPTIONS}
          onChange={form.setCategory}
        />
      </Field>

      <View className="flex-row gap-3">
        <View className="min-w-0 flex-1">
          <Field label="Unit" required helper="tabs, vials, pcs, boxes">
            <TextField
              value={form.unit}
              onChangeText={form.setUnit}
              placeholder="e.g. tabs"
              accessibilityLabel="Unit"
              maxLength={24}
            />
          </Field>
        </View>
        <View className="min-w-0 flex-1">
          <Field
            label="Reorder Level"
            required
            error={
              form.reorderLevel.trim() !== "" && !form.reorderValid
                ? "Enter a whole number of 0 or more."
                : null
            }
            helper="Low Stock is flagged at or below this."
          >
            <TextField
              value={form.reorderLevel}
              onChangeText={(next) => form.setReorderLevel(next.replace(/[^0-9]/g, ""))}
              placeholder="e.g. 50"
              accessibilityLabel="Reorder level"
              keyboardType="number-pad"
            />
          </Field>
        </View>
      </View>

      <Field label="Storage Condition">
        <SelectField
          label="Storage condition"
          value={form.storageCondition}
          options={STORAGE_OPTIONS}
          onChange={form.setStorageCondition}
        />
      </Field>

      <Field label="Supplier / Source">
        <SelectField
          label="Supplier"
          value={form.supplier}
          options={supplierOptionsFor(suppliers)}
          onChange={form.setSupplier}
        />
      </Field>

      <Field label="Description">
        <TextField
          value={form.description}
          onChangeText={form.setDescription}
          placeholder="Optional notes about this item"
          accessibilityLabel="Description"
          multiline
          maxLength={1000}
        />
      </Field>

      {isEdit ? (
        <View
          className="border p-3"
          style={{
            borderRadius: RADIUS.control,
            backgroundColor: palette.bannerBg,
            borderColor: palette.bannerBorder,
          }}
        >
          <Text className="text-[12px] font-medium leading-[17px]" style={{ color: palette.body }}>
            Current stock is {currentStock?.toLocaleString()} {unit} and cannot be edited here.
            Use Add Stock or Release Stock so the change is recorded in the item&apos;s history.
          </Text>
        </View>
      ) : null}
    </>
  );
};

export default ItemFormFields;
