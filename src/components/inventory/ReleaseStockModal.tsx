import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import type { SelectOption } from "@/components/users/SelectMenu";
import type { InventoryItem, StockOutPayload } from "@/services/inventoryService";
import { formatDate } from "@/utils/dateFormatter";
import InventoryFormModal, { Field, ReadOnlyValue, SelectField, TextField } from "./InventoryFormModal";
import { RADIUS, useInventoryPalette } from "./inventoryTheme";

type ReleaseType = NonNullable<StockOutPayload["type"]>;

const RELEASE_TYPE_OPTIONS: readonly SelectOption<ReleaseType>[] = [
  { value: "STOCK_OUT", label: "Dispensed / Released" },
  { value: "TRANSFER", label: "Transferred" },
  { value: "DAMAGED", label: "Damaged" },
  { value: "EXPIRED", label: "Expired — disposal" },
  { value: "ADJUSTMENT", label: "Adjustment" },
];

type ReleaseStockModalProps = {
  visible: boolean;
  item: InventoryItem | null;
  submitting: boolean;
  error: string | null;
  /** Shown on the released-by line; the server records the actual actor. */
  releasedByName: string;
  onSubmit: (payload: StockOutPayload) => void;
  onClose: () => void;
};

/**
 * Release Stock.
 *
 * The quantity is capped at what is actually available, and the batch is not
 * chosen here: the server allocates FEFO — nearest expiry first, skipping
 * expired lots — so a release cannot pull from the wrong box.
 */
export default function ReleaseStockModal({
  visible,
  item,
  submitting,
  error,
  releasedByName,
  onSubmit,
  onClose,
}: ReleaseStockModalProps) {
  const palette = useInventoryPalette();

  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState<ReleaseType>("STOCK_OUT");
  const [reason, setReason] = useState("");
  const [recipient, setRecipient] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (!visible) return;
    setQuantity("");
    setType("STOCK_OUT");
    setReason("");
    setRecipient("");
    setRemarks("");
  }, [visible, item]);

  if (!item) return null;

  const available = item.currentStock;
  const quantityNumber = Number(quantity);
  const quantityEntered = quantity.trim() !== "";
  const quantityPositive = Number.isInteger(quantityNumber) && quantityNumber > 0;
  const exceedsAvailable = quantityPositive && quantityNumber > available;
  const quantityValid = quantityPositive && !exceedsAvailable;

  const complete = quantityValid && reason.trim().length > 0;

  const quantityError = quantityEntered
    ? exceedsAvailable
      ? `Only ${available.toLocaleString()} ${item.unit} available.`
      : !quantityPositive
        ? "Enter a whole number above zero."
        : null
    : null;

  const nextBatchLine = item.batchNumber
    ? `Stock will be drawn from batch ${item.batchNumber}${
        item.nearestExpiry ? `, expiring ${formatDate(item.nearestExpiry)}` : ""
      } — the earliest expiry first (FEFO).`
    : "Stock will be drawn from the batch with the earliest expiry date (FEFO).";

  const handleSubmit = () => {
    onSubmit({
      quantity: quantityNumber,
      type,
      reason: reason.trim(),
      recipient: recipient.trim(),
      remarks: remarks.trim(),
    });
  };

  return (
    <InventoryFormModal
      visible={visible}
      title="Release Stock"
      subtitle={`Record stock leaving ${item.name}.`}
      icon="external-link"
      submitLabel="Release Stock"
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
          <Field label="Available Stock">
            <ReadOnlyValue value={`${available.toLocaleString()} ${item.unit}`} />
          </Field>
        </View>
        <View className="min-w-0 flex-1">
          <Field label="Quantity to Release" required error={quantityError}>
            <TextField
              value={quantity}
              onChangeText={(next) => setQuantity(next.replace(/[^0-9]/g, ""))}
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
        <SelectField
          label="Release type"
          value={type}
          options={RELEASE_TYPE_OPTIONS}
          onChange={setType}
        />
      </Field>

      <Field label="Reason" required>
        <TextField
          value={reason}
          onChangeText={setReason}
          placeholder="e.g. Dispensed to patient"
          accessibilityLabel="Reason for release"
          maxLength={300}
        />
      </Field>

      <Field label="Released To / Department">
        <TextField
          value={recipient}
          onChangeText={setRecipient}
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
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Optional notes about this release"
          accessibilityLabel="Remarks"
          multiline
          maxLength={500}
        />
      </Field>
    </InventoryFormModal>
  );
}
