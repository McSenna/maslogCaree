import type { SelectOption } from "@/components/ui/SelectMenu";
import type {
  ExpiryStatus,
  InventoryCategory,
  InventorySortKey,
  StockStatus,
} from "@/features/inventory/services/inventoryService";

export type CategoryFilter = InventoryCategory | "all";
export type StockStatusFilter = StockStatus | "all";
export type ExpiryStatusFilter = ExpiryStatus | "all";

export const CATEGORY_FILTER_OPTIONS: readonly SelectOption<CategoryFilter>[] = [
  { value: "all", label: "All Categories" },
  { value: "medicine", label: "Medicine" },
  { value: "vaccine", label: "Vaccine" },
  { value: "supply", label: "Supply" },
  { value: "equipment", label: "Equipment" },
  { value: "maternal", label: "Maternal Health" },
  { value: "other", label: "Other" },
];

export const STOCK_STATUS_FILTER_OPTIONS: readonly SelectOption<StockStatusFilter>[] = [
  { value: "all", label: "All Stock Statuses" },
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
];

export const EXPIRY_STATUS_FILTER_OPTIONS: readonly SelectOption<ExpiryStatusFilter>[] = [
  { value: "all", label: "All Expiry Statuses" },
  { value: "normal", label: "Normal" },
  { value: "expiring-soon", label: "Expiring Soon" },
  { value: "expired", label: "Expired" },
  { value: "none", label: "No Expiry" },
];

export const SORT_OPTIONS: readonly SelectOption<InventorySortKey>[] = [
  { value: "updated_desc", label: "Last Updated (Newest)" },
  { value: "updated_asc", label: "Last Updated (Oldest)" },
  { value: "name_asc", label: "Item Name A–Z" },
  { value: "name_desc", label: "Item Name Z–A" },
  { value: "stock_asc", label: "Lowest Stock" },
  { value: "stock_desc", label: "Highest Stock" },
  { value: "expiry_asc", label: "Nearest Expiry" },
  { value: "expiry_desc", label: "Latest Expiry" },
];

export const INVENTORY_COLUMNS = {
  checkbox: 48,
  item: 2.8,
  category: 1.3,
  batch: 1.35,
  stock: 0.8,
  unit: 0.9,
  reorderLevel: 1.5,
  expiry: 1.4,
  status: 1.6,
} as const;

export const CELL_PADDING = 10;

export const TABLE_MIN_WIDTH = 936;
