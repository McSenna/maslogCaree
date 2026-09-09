import { useCallback, useEffect, useRef, useState } from "react";
import {
  NO_PERMISSIONS,
  fetchInventoryItems,
  fetchInventorySummary,
  fetchSuppliers,
  type InventoryItem,
  type InventoryPermissions,
  type InventoryQuery,
  type InventorySummary,
  type InventorySupplier,
} from "@/services/inventoryService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

const EMPTY_SUMMARY: InventorySummary = {
  total: { value: 0, growth: null },
  inStock: { value: 0, growth: null },
  lowStock: { value: 0, growth: null },
  expiringSoon: { value: 0, growth: null },
  outOfStock: { value: 0, growth: null },
  expired: { value: 0, growth: null },
};

export type UseInventoryReturn = {
  items: InventoryItem[];
  summary: InventorySummary;
  suppliers: InventorySupplier[];
  permissions: InventoryPermissions;
  total: number;
  totalPages: number;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  /** Re-runs the list and the summary against the current query. */
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
  /** Replaces one row in place after a mutation returns the updated record. */
  applyItemUpdate: (item: InventoryItem) => void;
};

/**
 * Inventory list state.
 *
 * Filtering, sorting and paging are all server-side, so the query is the
 * dependency: any change to it refetches rather than re-slicing a local array.
 * A page filtered on the client would report a total that disagreed with the
 * pagination footer as soon as the list outgrew one page.
 */
export function useInventory(query: InventoryQuery): UseInventoryReturn {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [summary, setSummary] = useState<InventorySummary>(EMPTY_SUMMARY);
  const [suppliers, setSuppliers] = useState<InventorySupplier[]>([]);
  const [permissions, setPermissions] = useState<InventoryPermissions>(NO_PERMISSIONS);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Every field is read individually so the effect depends on the values rather
  // than on the object's identity — the caller builds a fresh query object on
  // each render, which would otherwise refetch on every keystroke elsewhere.
  const { page, limit, search, category, stockStatus, expiryStatus, sort } = query;

  /** Guards against an earlier request finishing after a later one. */
  const requestIdRef = useRef(0);

  const load = useCallback(
    async (mode: "initial" | "refresh") => {
      const requestId = ++requestIdRef.current;
      if (mode === "refresh") setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const [list, summaryResult] = await Promise.all([
          fetchInventoryItems({ page, limit, search, category, stockStatus, expiryStatus, sort }),
          fetchInventorySummary(),
        ]);

        if (requestId !== requestIdRef.current) return;

        setItems(list.items);
        setTotal(list.total);
        setTotalPages(list.totalPages);
        setPermissions(list.permissions);
        setSummary(summaryResult);
      } catch (e: unknown) {
        if (requestId !== requestIdRef.current) return;
        setError(getApiErrorMessage(e, "Unable to load inventory. Please try again."));
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [page, limit, search, category, stockStatus, expiryStatus, sort]
  );

  useEffect(() => {
    void load("initial");
  }, [load]);

  // The supplier list changes rarely and is only needed by the forms, so it is
  // fetched once rather than alongside every list request. A failure is not
  // surfaced: the forms fall back to "not recorded" and stay usable.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchSuppliers();
        if (!cancelled) setSuppliers(result);
      } catch {
        if (!cancelled) setSuppliers([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = useCallback(() => load("initial"), [load]);
  const refresh = useCallback(() => load("refresh"), [load]);

  const applyItemUpdate = useCallback((updated: InventoryItem) => {
    setItems((prev) => prev.map((item) => (item._id === updated._id ? { ...item, ...updated } : item)));
  }, []);

  return {
    items,
    summary,
    suppliers,
    permissions,
    total,
    totalPages,
    loading,
    refreshing,
    error,
    reload,
    refresh,
    applyItemUpdate,
  };
}
