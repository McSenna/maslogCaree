import type { Feather } from "@expo/vector-icons";
import {
  STORAGE_CONDITION_LABELS,
  type InventoryItem,
  type StorageCondition,
} from "@/services/inventoryService";
import { formatDate } from "@/utils/dateFormatter";

export type DetailField = {
  key: string;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  emphasis?: boolean;
};

/**
 * The rows Item Details shows, in order.
 *
 * The seven core rows are always present because every item has them. Anything
 * category-specific is appended only when the record actually carries a value —
 * an empty "Generic Name" line tells the reader nothing and costs a row of
 * vertical space on a phone.
 *
 * Equipment's serial number, maintenance dates and assigned location are not
 * modelled by the inventory schema, so they are deliberately absent rather than
 * rendered as blanks; adding them is a backend change, not a display one.
 */
export function buildDetailFields(item: InventoryItem): DetailField[] {
  const storageLabel =
    STORAGE_CONDITION_LABELS[item.storageCondition as StorageCondition] ||
    item.storageCondition ||
    "Not specified";

  const fields: DetailField[] = [
    {
      key: "stock",
      icon: "package",
      label: "Current Stock",
      value: `${item.currentStock.toLocaleString()} ${item.unit}`,
    },
    {
      key: "batch",
      icon: "hash",
      label: "Batch / Lot No.",
      value: item.batchNumber || "—",
    },
    {
      key: "expiry",
      icon: "calendar",
      label: "Expiry Date",
      value: item.nearestExpiry ? formatDate(item.nearestExpiry) : "No expiry",
      emphasis: item.expiryStatus === "expired" || item.expiryStatus === "urgent",
    },
    {
      key: "reorder",
      icon: "bar-chart-2",
      label: "Reorder Level",
      value: `${item.reorderLevel.toLocaleString()} ${item.unit}`,
    },
    {
      key: "supplier",
      icon: "truck",
      label: "Supplier / Source",
      value: item.supplier?.name || "Not recorded",
    },
    {
      key: "restocked",
      icon: "clock",
      label: "Last Restocked",
      value: item.lastRestockedAt ? formatDate(item.lastRestockedAt) : "Never restocked",
    },
    {
      key: "storage",
      icon: "thermometer",
      label: "Storage Condition",
      value: storageLabel,
    },
  ];

  // Medicines and vaccines are ordered and substituted by generic name, so it
  // earns a row wherever it is recorded.
  if (item.genericName && ["medicine", "vaccine", "maternal"].includes(item.category)) {
    fields.push({
      key: "generic",
      icon: "tag",
      label: "Generic Name",
      value: item.genericName,
    });
  }

  // Cold chain is a consequence of the storage condition rather than a second
  // stored field, so it is stated only where it actually applies.
  if (
    item.category === "vaccine" &&
    (item.storageCondition === "refrigerated" || item.storageCondition === "frozen")
  ) {
    fields.push({
      key: "cold-chain",
      icon: "alert-circle",
      label: "Cold Chain",
      value: "Required",
    });
  }

  return fields;
}
