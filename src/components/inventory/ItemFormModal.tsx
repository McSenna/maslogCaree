import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import type { SelectOption } from "@/components/users/SelectMenu";
import {
  CATEGORY_LABELS,
  STORAGE_CONDITION_LABELS,
  type InventoryCategory,
  type InventoryItem,
  type InventorySupplier,
  type ItemMetadataPayload,
  type StorageCondition,
} from "@/services/inventoryService";
import InventoryFormModal, { Field, SelectField, TextField } from "./InventoryFormModal";
import { RADIUS, useInventoryPalette } from "./inventoryTheme";

const CATEGORY_OPTIONS: readonly SelectOption<InventoryCategory>[] = (
  Object.keys(CATEGORY_LABELS) as InventoryCategory[]
).map((value) => ({ value, label: CATEGORY_LABELS[value] }));

const STORAGE_OPTIONS: readonly SelectOption<StorageCondition>[] = (
  Object.keys(STORAGE_CONDITION_LABELS) as StorageCondition[]
).map((value) => ({ value, label: STORAGE_CONDITION_LABELS[value] }));

type ItemFormModalProps = {
  visible: boolean;
  /** Null creates a new item; an item edits its metadata. */
  item: InventoryItem | null;
  suppliers: InventorySupplier[];
  submitting: boolean;
  error: string | null;
  onSubmit: (payload: ItemMetadataPayload) => void;
  onClose: () => void;
};

/**
 * Add Item / Edit Item — metadata only.
 *
 * Stock is deliberately absent: quantity changes go through Add Stock and
 * Release Stock so every movement lands in the ledger. The server rejects a
 * stock field here as well, so the omission is enforced, not merely implied.
 */
export default function ItemFormModal({
  visible,
  item,
  suppliers,
  submitting,
  error,
  onSubmit,
  onClose,
}: ItemFormModalProps) {
  const palette = useInventoryPalette();
  const isEdit = item !== null;

  const [name, setName] = useState("");
  const [specification, setSpecification] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState<InventoryCategory>("medicine");
  const [unit, setUnit] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [storageCondition, setStorageCondition] = useState<StorageCondition>("room-temperature");
  const [supplier, setSupplier] = useState<string>("none");
  const [description, setDescription] = useState("");

  // Reset to the record being edited every time the dialog opens, so a previous
  // item's values are never carried into the next one.
  useEffect(() => {
    if (!visible) return;
    setName(item?.name ?? "");
    setSpecification(item?.specification ?? "");
    setGenericName(item?.genericName ?? "");
    setCategory(item?.category ?? "medicine");
    setUnit(item?.unit ?? "");
    setReorderLevel(item ? String(item.reorderLevel) : "");
    setStorageCondition((item?.storageCondition as StorageCondition) || "room-temperature");
    setSupplier(item?.supplier?._id ?? "none");
    setDescription(item?.description ?? "");
  }, [visible, item]);

  const supplierOptions: readonly SelectOption<string>[] = [
    { value: "none", label: "No supplier recorded" },
    ...suppliers.map((entry) => ({ value: entry._id, label: entry.name })),
  ];

  const reorderNumber = Number(reorderLevel);
  const reorderValid =
    reorderLevel.trim() !== "" && Number.isInteger(reorderNumber) && reorderNumber >= 0;

  const complete = name.trim().length > 0 && unit.trim().length > 0 && reorderValid;

  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      specification: specification.trim(),
      genericName: genericName.trim(),
      description: description.trim(),
      category,
      unit: unit.trim(),
      reorderLevel: reorderNumber,
      storageCondition,
      supplier: supplier === "none" ? null : supplier,
    });
  };

  return (
    <InventoryFormModal
      visible={visible}
      title={isEdit ? "Edit Item" : "Add Inventory Item"}
      subtitle={
        isEdit
          ? "Update this item's details. Stock quantity is changed through Add Stock or Release Stock."
          : "Create the item first, then receive its stock through Add Stock."
      }
      icon={isEdit ? "edit-2" : "plus-square"}
      submitLabel={isEdit ? "Save Changes" : "Create Item"}
      submitDisabled={!complete}
      submitting={submitting}
      error={error}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Field label="Item Name" required>
        <TextField
          value={name}
          onChangeText={setName}
          placeholder="e.g. Paracetamol 500mg"
          accessibilityLabel="Item name"
          maxLength={160}
        />
      </Field>

      <Field label="Specification" helper="Dosage form or packaging — shown under the item name.">
        <TextField
          value={specification}
          onChangeText={setSpecification}
          placeholder="e.g. Tablet, 0.5 mL (Adult), Box (100 pcs)"
          accessibilityLabel="Specification"
          maxLength={120}
        />
      </Field>

      <Field label="Generic Name">
        <TextField
          value={genericName}
          onChangeText={setGenericName}
          placeholder="e.g. Paracetamol"
          accessibilityLabel="Generic name"
          maxLength={160}
        />
      </Field>

      <Field label="Category" required>
        <SelectField label="Category" value={category} options={CATEGORY_OPTIONS} onChange={setCategory} />
      </Field>

      <View className="flex-row gap-3">
        <View className="min-w-0 flex-1">
          <Field label="Unit" required helper="tabs, vials, pcs, boxes">
            <TextField
              value={unit}
              onChangeText={setUnit}
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
            error={reorderLevel.trim() !== "" && !reorderValid ? "Enter a whole number of 0 or more." : null}
            helper="Low Stock is flagged at or below this."
          >
            <TextField
              value={reorderLevel}
              onChangeText={(next) => setReorderLevel(next.replace(/[^0-9]/g, ""))}
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
          value={storageCondition}
          options={STORAGE_OPTIONS}
          onChange={setStorageCondition}
        />
      </Field>

      <Field label="Supplier / Source">
        <SelectField
          label="Supplier"
          value={supplier}
          options={supplierOptions}
          onChange={setSupplier}
        />
      </Field>

      <Field label="Description">
        <TextField
          value={description}
          onChangeText={setDescription}
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
            Current stock is {item?.currentStock.toLocaleString()} {item?.unit} and cannot be edited here.
            Use Add Stock or Release Stock so the change is recorded in the item&apos;s history.
          </Text>
        </View>
      ) : null}
    </InventoryFormModal>
  );
}
