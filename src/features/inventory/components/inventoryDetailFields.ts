import type { Feather } from "@expo/vector-icons";
import {
  STORAGE_CONDITION_LABELS,
  type InventoryItem,
  type StorageCondition,
} from "@/features/inventory/services/inventoryService";
import { formatDate } from "@/utils/dateFormatter";

export type DetailField = {
  key: string;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  emphasis?: boolean;
};

export const buildDetailFields = (item: InventoryItem): DetailField[] => {
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

  if (item.genericName && ["medicine", "vaccine", "maternal"].includes(item.category)) {
    fields.push({
      key: "generic",
      icon: "tag",
      label: "Generic Name",
      value: item.genericName,
    });
  }

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
};
