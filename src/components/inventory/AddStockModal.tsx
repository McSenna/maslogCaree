import { useEffect, useState } from "react";
import { View } from "react-native";
import type { SelectOption } from "@/components/users/SelectMenu";
import {
  STORAGE_CONDITION_LABELS,
  type InventoryItem,
  type InventorySupplier,
  type StockInPayload,
  type StorageCondition,
} from "@/services/inventoryService";
import InventoryFormModal, { Field, ReadOnlyValue, SelectField, TextField } from "./InventoryFormModal";

const STORAGE_OPTIONS: readonly SelectOption<StorageCondition>[] = (
  Object.keys(STORAGE_CONDITION_LABELS) as StorageCondition[]
).map((value) => ({ value, label: STORAGE_CONDITION_LABELS[value] }));

/** Categories the server requires an expiry date for. Mirrors the model. */
const PERISHABLE: InventoryItem["category"][] = ["medicine", "vaccine", "maternal", "supply"];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const todayIso = () => new Date().toISOString().slice(0, 10);

type AddStockModalProps = {
  visible: boolean;
  item: InventoryItem | null;
  suppliers: InventorySupplier[];
  submitting: boolean;
  error: string | null;
  onSubmit: (payload: StockInPayload) => void;
  onClose: () => void;
};

/**
 * Add Stock — receiving a lot into the item.
 *
 * The item, its unit and its storage default are pre-filled from the record
 * being received into; only the lot's own facts are asked for. A lot number
 * that already exists tops that lot up rather than creating a duplicate, which
 * is what the server does with it.
 */
export default function AddStockModal({
  visible,
  item,
  suppliers,
  submitting,
  error,
  onSubmit,
  onClose,
}: AddStockModalProps) {
  const [quantity, setQuantity] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [supplier, setSupplier] = useState("none");
  const [source, setSource] = useState("");
  const [receivedDate, setReceivedDate] = useState(todayIso());
  const [storageCondition, setStorageCondition] = useState<StorageCondition>("room-temperature");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (!visible) return;
    setQuantity("");
    setBatchNumber("");
    setExpiryDate("");
    setSupplier(item?.supplier?._id ?? "none");
    setSource("");
    setReceivedDate(todayIso());
    setStorageCondition((item?.storageCondition as StorageCondition) || "room-temperature");
    setRemarks("");
  }, [visible, item]);

  if (!item) return null;

  const supplierOptions: readonly SelectOption<string>[] = [
    { value: "none", label: "Not recorded" },
    ...suppliers.map((entry) => ({ value: entry._id, label: entry.name })),
  ];

  const quantityNumber = Number(quantity);
  const quantityValid = quantity.trim() !== "" && Number.isInteger(quantityNumber) && quantityNumber > 0;

  const expiryRequired = PERISHABLE.includes(item.category);
  const expiryFormatValid = expiryDate === "" || ISO_DATE.test(expiryDate);
  // A lot that is already out of date must not be received: the server refuses
  // it, and catching it here keeps the round trip out of the way.
  const expiryInPast = ISO_DATE.test(expiryDate) && expiryDate < todayIso();
  const expiryValid = (!expiryRequired || ISO_DATE.test(expiryDate)) && expiryFormatValid && !expiryInPast;

  const receivedValid = ISO_DATE.test(receivedDate);

  const complete = quantityValid && batchNumber.trim().length > 0 && expiryValid && receivedValid;

  const expiryError = !expiryFormatValid
    ? "Use the format YYYY-MM-DD."
    : expiryInPast
      ? "Expiry date cannot be in the past. Expired stock must not be received."
      : expiryRequired && expiryDate === ""
        ? `An expiry date is required for ${item.category} stock.`
        : null;

  const handleSubmit = () => {
    onSubmit({
      quantity: quantityNumber,
      batchNumber: batchNumber.trim(),
      expiryDate: expiryDate ? expiryDate : null,
      supplier: supplier === "none" ? null : supplier,
      source: source.trim(),
      receivedDate,
      storageCondition,
      remarks: remarks.trim(),
    });
  };

  return (
    <InventoryFormModal
      visible={visible}
      title="Add Stock"
      subtitle={`Receive a new batch into ${item.name}.`}
      icon="plus"
      submitLabel="Add Stock"
      submitDisabled={!complete}
      submitting={submitting}
      error={error}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Field label="Item">
        <ReadOnlyValue value={`${item.name}${item.specification ? ` — ${item.specification}` : ""}`} />
      </Field>

      <View className="flex-row gap-3">
        <View className="min-w-0 flex-1">
          <Field
            label="Quantity"
            required
            error={quantity.trim() !== "" && !quantityValid ? "Enter a whole number above zero." : null}
          >
            <TextField
              value={quantity}
              onChangeText={(next) => setQuantity(next.replace(/[^0-9]/g, ""))}
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

      <Field label="Batch / Lot No." required helper="Receiving an existing lot number tops that lot up.">
        <TextField
          value={batchNumber}
          onChangeText={setBatchNumber}
          placeholder="e.g. PAR2024091"
          accessibilityLabel="Batch or lot number"
          maxLength={60}
        />
      </Field>

      <Field
        label="Expiry Date"
        required={expiryRequired}
        error={expiryError}
        helper={expiryRequired ? null : "Leave blank for items that do not expire."}
      >
        <TextField
          value={expiryDate}
          onChangeText={setExpiryDate}
          placeholder="YYYY-MM-DD"
          accessibilityLabel="Expiry date"
        />
      </Field>

      <Field label="Supplier / Source">
        <SelectField label="Supplier" value={supplier} options={supplierOptions} onChange={setSupplier} />
      </Field>

      <Field label="Source Note" helper="Where this delivery came from, if not a listed supplier.">
        <TextField
          value={source}
          onChangeText={setSource}
          placeholder="e.g. DOH / City Health Office"
          accessibilityLabel="Source"
          maxLength={200}
        />
      </Field>

      <Field
        label="Date Received"
        required
        error={receivedDate !== "" && !receivedValid ? "Use the format YYYY-MM-DD." : null}
      >
        <TextField
          value={receivedDate}
          onChangeText={setReceivedDate}
          placeholder="YYYY-MM-DD"
          accessibilityLabel="Date received"
        />
      </Field>

      <Field label="Storage Condition">
        <SelectField
          label="Storage condition"
          value={storageCondition}
          options={STORAGE_OPTIONS}
          onChange={setStorageCondition}
        />
      </Field>

      <Field label="Remarks">
        <TextField
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Optional notes about this delivery"
          accessibilityLabel="Remarks"
          multiline
          maxLength={500}
        />
      </Field>
    </InventoryFormModal>
  );
}
