import type { SelectOption } from "@/components/ui/SelectMenu";
import {
  CATEGORY_LABELS,
  STORAGE_CONDITION_LABELS,
  type InventoryCategory,
  type InventorySupplier,
  type StorageCondition,
} from "@/features/inventory/services/inventoryService";

export const CATEGORY_OPTIONS: readonly SelectOption<InventoryCategory>[] = (
  Object.keys(CATEGORY_LABELS) as InventoryCategory[]
).map((value) => ({ value, label: CATEGORY_LABELS[value] }));

export const STORAGE_OPTIONS: readonly SelectOption<StorageCondition>[] = (
  Object.keys(STORAGE_CONDITION_LABELS) as StorageCondition[]
).map((value) => ({ value, label: STORAGE_CONDITION_LABELS[value] }));

export const supplierOptionsFor = (
  suppliers: InventorySupplier[]
): readonly SelectOption<string>[] => [
  { value: "none", label: "No supplier recorded" },
  ...suppliers.map((entry) => ({ value: entry._id, label: entry.name })),
];
