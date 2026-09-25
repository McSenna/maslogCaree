import { useState } from "react";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";

import type {
  InventoryItem,
  StockInPayload,
  StorageCondition,
} from "@/features/inventory/services/inventoryService";

const PERISHABLE: InventoryItem["category"][] = ["medicine", "vaccine", "maternal", "supply"];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const useAddStockState = (visible: boolean, item: InventoryItem | null) => {
  const [quantity, setQuantity] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [supplier, setSupplier] = useState("none");
  const [source, setSource] = useState("");
  const [receivedDate, setReceivedDate] = useState(todayIso());
  const [storageCondition, setStorageCondition] = useState<StorageCondition>("room-temperature");
  const [remarks, setRemarks] = useState("");

  useSyncOnChange([visible, item], () => {
    if (!visible) return;
    setQuantity("");
    setBatchNumber("");
    setExpiryDate("");
    setSupplier(item?.supplier?._id ?? "none");
    setSource("");
    setReceivedDate(todayIso());
    setStorageCondition((item?.storageCondition as StorageCondition) || "room-temperature");
    setRemarks("");
  });

  const quantityNumber = Number(quantity);
  const quantityValid =
    quantity.trim() !== "" && Number.isInteger(quantityNumber) && quantityNumber > 0;

  const expiryRequired = item ? PERISHABLE.includes(item.category) : false;
  const expiryFormatValid = expiryDate === "" || ISO_DATE.test(expiryDate);
  const expiryInPast = ISO_DATE.test(expiryDate) && expiryDate < todayIso();
  const expiryValid =
    (!expiryRequired || ISO_DATE.test(expiryDate)) && expiryFormatValid && !expiryInPast;

  const receivedValid = ISO_DATE.test(receivedDate);

  const complete = quantityValid && batchNumber.trim().length > 0 && expiryValid && receivedValid;

  const expiryError = !expiryFormatValid
    ? "Use the format YYYY-MM-DD."
    : expiryInPast
      ? "Expiry date cannot be in the past. Expired stock must not be received."
      : expiryRequired && expiryDate === ""
        ? `An expiry date is required for ${item?.category} stock.`
        : null;

  const toPayload = (): StockInPayload => ({
    quantity: quantityNumber,
    batchNumber: batchNumber.trim(),
    expiryDate: expiryDate ? expiryDate : null,
    supplier: supplier === "none" ? null : supplier,
    source: source.trim(),
    receivedDate,
    storageCondition,
    remarks: remarks.trim(),
  });

  return {
    quantity,
    setQuantity,
    batchNumber,
    setBatchNumber,
    expiryDate,
    setExpiryDate,
    supplier,
    setSupplier,
    source,
    setSource,
    receivedDate,
    setReceivedDate,
    receivedValid,
    storageCondition,
    setStorageCondition,
    remarks,
    setRemarks,
    quantityValid,
    expiryRequired,
    expiryError,
    complete,
    toPayload,
  };
};

export type AddStockState = ReturnType<typeof useAddStockState>;
