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
} from "@/features/inventory/services/inventoryService";
import { getApiErrorMessage, isOfflineError } from "@/utils/apiErrorHandler";
import { reportError } from "@/utils/errorReporting";
import { toastBackgroundError, toastError } from "@/utils/errorToast/toastError";
import { useRealtimePagedList } from "@/hooks/realtime/useRealtimePagedList";

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
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
  /** Reloads the page on screen without a skeleton, keeping the rows visible meanwhile. */
  revalidate: () => Promise<void>;
  applyItemUpdate: (item: InventoryItem) => void;
};

export const useInventory = (query: InventoryQuery): UseInventoryReturn => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [summary, setSummary] = useState<InventorySummary>(EMPTY_SUMMARY);
  const [suppliers, setSuppliers] = useState<InventorySupplier[]>([]);
  const [permissions, setPermissions] = useState<InventoryPermissions>(NO_PERMISSIONS);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { page, limit, search, category, stockStatus, expiryStatus, sort } = query;

  const requestIdRef = useRef(0);

  const load = useCallback(
    async (mode: "initial" | "refresh" | "silent") => {
      const requestId = ++requestIdRef.current;
      if (mode === "refresh") setRefreshing(true);
      if (mode === "initial") setLoading(true);
      if (mode !== "silent") setError(null);

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
        // A failed quiet reload keeps the table on screen and says it may be behind; the next change or reconnect retries.
        if (requestId !== requestIdRef.current) return;
        if (mode === "silent") return toastBackgroundError("Inventory not updated", e);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    void load("initial");
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchSuppliers();
        if (!cancelled) setSuppliers(result);
      } catch (error: unknown) {
        if (cancelled) return;
        setSuppliers([]);
        // A dropped connection already shows on the page itself.
        if (isOfflineError(error)) return reportError("Inventory suppliers not loaded", error);
        // Without the list the supplier field only offers "No supplier recorded", so say why.
        toastError("Supplier list not loaded", error, { fallback: "Suppliers cannot be chosen right now. Reopen inventory to try again." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = useCallback(() => load("initial"), [load]);
  const refresh = useCallback(() => load("refresh"), [load]);
  const revalidate = useCallback(() => load("silent"), [load]);

  const applyItemUpdate = useCallback((updated: InventoryItem) => {
    setItems((prev) => prev.map((item) => (item._id === updated._id ? { ...item, ...updated } : item)));
  }, []);

  // Stock moving on another device shows on the row at once; a quiet reload of
  // this page then fixes the summary cards, filters and sort. This replaces the
  // reload that used to run on every return to the screen.
  useRealtimePagedList("inventoryItem", {
    patch: (change) => {
      if (change.action === "deleted") setItems((prev) => prev.filter((item) => item._id !== change.id));
      else applyItemUpdate(change.record);
    },
    reload: revalidate,
  });

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
    revalidate,
    applyItemUpdate,
  };
};
