import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchInventoryItems,
  type InventoryCategory,
  type InventoryItem,
} from "@/features/inventory/services/inventoryService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

const SEARCH_DEBOUNCE_MS = 350;
const PAGE_SIZE = 20;

export const useInventorySearch = (visible: boolean, category?: InventoryCategory) => {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setDebounced(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search, visible]);

  useEffect(() => {
    if (visible) return;
    setSearch("");
    setDebounced("");
    setItems([]);
    setPage(1);
    setError(null);
  }, [visible]);

  const load = useCallback(
    async (targetPage: number, term: string) => {
      const token = ++requestRef.current;
      if (targetPage === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const result = await fetchInventoryItems({
          page: targetPage,
          limit: PAGE_SIZE,
          search: term || undefined,
          ...(category ? { category } : {}),
          sort: "name_asc",
        });
        if (token !== requestRef.current) return;
        setItems((current) => (targetPage === 1 ? result.items : [...current, ...result.items]));
        setPage(result.page);
        setTotalPages(result.totalPages);
      } catch (e: unknown) {
        if (token !== requestRef.current) return;
        setError(getApiErrorMessage(e, "The inventory could not be loaded."));
      } finally {
        if (token === requestRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [category]
  );

  useEffect(() => {
    if (!visible) return;
    void load(1, debounced);
  }, [visible, debounced, load]);

  return {
    search,
    setSearch,
    debounced,
    items,
    page,
    loading,
    loadingMore,
    error,
    canLoadMore: page < totalPages && !loading && !loadingMore,
    load,
  };
};
