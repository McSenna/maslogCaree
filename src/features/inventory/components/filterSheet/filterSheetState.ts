import type { InventorySortKey } from "@/features/inventory/services/inventoryService";

import type {
  CategoryFilter,
  ExpiryStatusFilter,
  StockStatusFilter,
} from "../inventoryFilters";

export type InventoryFilterState = {
  category: CategoryFilter;
  stockStatus: StockStatusFilter;
  expiryStatus: ExpiryStatusFilter;
  sort: InventorySortKey;
};

export const DEFAULT_FILTERS: InventoryFilterState = {
  category: "all",
  stockStatus: "all",
  expiryStatus: "all",
  sort: "updated_desc",
};

export const resetDraft = (
  previous: InventoryFilterState,
  isSort: boolean
): InventoryFilterState =>
  isSort
    ? { ...previous, sort: DEFAULT_FILTERS.sort }
    : {
        ...previous,
        category: DEFAULT_FILTERS.category,
        stockStatus: DEFAULT_FILTERS.stockStatus,
        expiryStatus: DEFAULT_FILTERS.expiryStatus,
      };
