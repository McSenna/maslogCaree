import { useCallback, useMemo } from "react";
import { usePersistedPagination } from "@/hooks/usePersistedPagination";
import { DEFAULT_FILTERS, type InventoryFilterState } from "../components/InventoryFilterSheet";
import { SEARCH_DEBOUNCE_MS } from "../constants/inventoryLayout";
import { activeInventoryCard, CARD_FILTERS } from "../components/inventoryCardFilters";
import type { InventoryMetricKey } from "../components/inventoryTheme";
import { INVENTORY_LIST_SCHEMA } from "./inventoryListSchema";

/**
 * Search, filters, sort and page for the inventory table, kept in the URL (and
 * on phones, the last view) so a refresh or a reopened app lands on the same
 * page. `total` is the item count of the last load, null before the first.
 */
export const useInventoryQuery = (total: number | null) => {
  const list = usePersistedPagination({
    key: "inventory",
    schema: INVENTORY_LIST_SCHEMA,
    total,
    searchDebounceMs: SEARCH_DEBOUNCE_MS,
  });
  const { filters, page, limit, search, setFilters, replaceSearch } = list;
  const { category, stockStatus, expiryStatus, sort } = filters;

  const applyFilters = useCallback((next: InventoryFilterState) => setFilters(next), [setFilters]);

  const clearFilters = useCallback(() => {
    replaceSearch("");
    setFilters({ category: DEFAULT_FILTERS.category, stockStatus: DEFAULT_FILTERS.stockStatus, expiryStatus: DEFAULT_FILTERS.expiryStatus });
  }, [replaceSearch, setFilters]);

  // A summary card shows its own slice: search and category are cleared so the
  // list matches the card's count.
  const showCard = useCallback(
    (key: InventoryMetricKey) => {
      replaceSearch("");
      setFilters({ category: "all", ...CARD_FILTERS[key] });
    },
    [replaceSearch, setFilters]
  );

  const query = useMemo(
    () => ({ page, limit, search, category, stockStatus, expiryStatus, sort }),
    [page, limit, search, category, stockStatus, expiryStatus, sort]
  );

  return {
    query,
    searchInput: list.searchInput,
    setSearchInput: list.setSearchInput,
    filters,
    applyFilters,
    clearFilters,
    showCard,
    activeCard: activeInventoryCard(filters, search),
    page,
    setPage: list.setPage,
    isClamping: list.isClamping,
    hasActiveFilters:
      search.length > 0 ||
      category !== "all" ||
      stockStatus !== "all" ||
      expiryStatus !== "all",
    activeFilterCount: [category, stockStatus, expiryStatus].filter((value) => value !== "all")
      .length,
  };
};
