import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_FILTERS, type InventoryFilterState } from "../components/InventoryFilterSheet";
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../constants/inventoryLayout";

export const useInventoryQuery = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<InventoryFilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const { category, stockStatus, expiryStatus, sort } = filters;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const applyFilters = useCallback((next: InventoryFilterState) => {
    setFilters(next);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setSearch("");
    setFilters((previous) => ({ ...DEFAULT_FILTERS, sort: previous.sort }));
    setPage(1);
  }, []);

  const clampPage = useCallback((totalPages: number) => {
    setPage((current) => Math.min(current, Math.max(1, totalPages)));
  }, []);

  const query = useMemo(
    () => ({ page, limit: PAGE_SIZE, search, category, stockStatus, expiryStatus, sort }),
    [page, search, category, stockStatus, expiryStatus, sort]
  );

  return {
    query,
    searchInput,
    setSearchInput,
    filters,
    applyFilters,
    clearFilters,
    page,
    setPage,
    clampPage,
    hasActiveFilters:
      search.length > 0 ||
      category !== "all" ||
      stockStatus !== "all" ||
      expiryStatus !== "all",
    activeFilterCount: [category, stockStatus, expiryStatus].filter((value) => value !== "all")
      .length,
  };
};
