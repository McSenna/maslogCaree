import { useState } from "react";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";
import type { InventoryItem, StockOutPayload } from "@/features/inventory/services/inventoryService";

export type ReleaseType = NonNullable<StockOutPayload["type"]>;

export const useReleaseStockForm = (visible: boolean, item: InventoryItem | null) => {
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState<ReleaseType>("STOCK_OUT");
  const [reason, setReason] = useState("");
  const [recipient, setRecipient] = useState("");
  const [remarks, setRemarks] = useState("");

  useSyncOnChange([visible, item], () => {
    if (!visible) return;
    setQuantity("");
    setType("STOCK_OUT");
    setReason("");
    setRecipient("");
    setRemarks("");
  });

  const available = item?.currentStock ?? 0;
  const quantityNumber = Number(quantity);
  const quantityEntered = quantity.trim() !== "";
  const quantityPositive = Number.isInteger(quantityNumber) && quantityNumber > 0;
  const exceedsAvailable = quantityPositive && quantityNumber > available;
  const quantityValid = quantityPositive && !exceedsAvailable;

  const complete = quantityValid && reason.trim().length > 0;

  const quantityError = quantityEntered
    ? exceedsAvailable
      ? `Only ${available.toLocaleString()} ${item?.unit} available.`
      : !quantityPositive
        ? "Enter a whole number above zero."
        : null
    : null;

  const buildPayload = (): StockOutPayload => ({
    quantity: quantityNumber,
    type,
    reason: reason.trim(),
    recipient: recipient.trim(),
    remarks: remarks.trim(),
  });

  return {
    quantity,
    setQuantity,
    type,
    setType,
    reason,
    setReason,
    recipient,
    setRecipient,
    remarks,
    setRemarks,
    available,
    complete,
    quantityError,
    buildPayload,
  };
};
