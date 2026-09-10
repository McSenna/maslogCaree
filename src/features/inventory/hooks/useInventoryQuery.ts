import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_FILTERS, type InventoryFilterState } from "../components/InventoryFilterSheet";
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../constants/inventoryLayout";

/**
 * What the list is currently asking the server for: the search term, the
 * filters, the sort and the page.
 *
 * Kept apart from the results so the query can settle — debouncing a keystroke,
 * resetting to page 1 — without the fetching hook having to know why it
 * changed.
 */
export function useInventoryQuery() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  // Held as one object rather than four states: the phone's filter sheet edits
  // a draft and commits it in a single Apply, which four setters would turn
  // into four renders and four refetches.
  const [filters, setFilters] = useState<InventoryFilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const { category, stockStatus, expiryStatus, sort } = filters;

  // Typing must not fire a request per keystroke; the committed term is what
  // the query depends on.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  /** Any filter change returns to page 1 — page 4 of the old result set is meaningless. */
  const applyFilters = useCallback((next: InventoryFilterState) => {
    setFilters(next);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setSearch("");
    // Sort is a view preference, not a filter, so "Clear Filters" leaves it be.
    setFilters((previous) => ({ ...DEFAULT_FILTERS, sort: previous.sort }));
    setPage(1);
  }, []);

  /** Narrowing the results can leave the current page past the end of the list. */
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
    /** How many filters are set, for the phone's Filters button badge. */
    activeFilterCount: [category, stockStatus, expiryStatus].filter((value) => value !== "all")
      .length,
  };
}
