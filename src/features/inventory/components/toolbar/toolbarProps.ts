import type { InventorySortKey } from "@/features/inventory/services/inventoryService";
import type { CategoryFilter, ExpiryStatusFilter, StockStatusFilter } from "../inventoryFilters";

export const SEARCH_PLACEHOLDER = "Search medicines, vaccines, supplies, equipment...";

export type InventoryToolbarFilters = {
  search: string;
  onSearchChange: (value: string) => void;
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  stockStatus: StockStatusFilter;
  onStockStatusChange: (value: StockStatusFilter) => void;
  expiryStatus: ExpiryStatusFilter;
  onExpiryStatusChange: (value: ExpiryStatusFilter) => void;
  sort: InventorySortKey;
  onSortChange: (value: InventorySortKey) => void;
  onAddItem: () => void;
  canAddItem: boolean;
};
