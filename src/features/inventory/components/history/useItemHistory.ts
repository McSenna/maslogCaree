import { useCallback, useEffect, useState } from "react";

import {
  fetchItemHistory,
  type InventoryItem,
  type InventoryTransactionEntry,
} from "@/features/inventory/services/inventoryService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export const useItemHistory = (visible: boolean, item: InventoryItem | null) => {
  const [entries, setEntries] = useState<InventoryTransactionEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (targetPage: number) => {
      if (!item) return;
      const first = targetPage === 1;
      if (first) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const result = await fetchItemHistory(item._id, targetPage);
        setEntries((prev) => (first ? result.history : [...prev, ...result.history]));
        setPage(result.page);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      } catch (e: unknown) {
        setError(getApiErrorMessage(e, "Unable to load this item's history. Please try again."));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [item]
  );

  useEffect(() => {
    if (!visible || !item) return;
    setEntries([]);
    setPage(1);
    setTotalPages(1);
    void load(1);
  }, [visible, item, load]);

  return {
    entries,
    page,
    total,
    loading,
    loadingMore,
    error,
    hasMore: page < totalPages,
    load,
  };
};
