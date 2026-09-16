import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
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

  const loadRef = useRef(load);
  loadRef.current = load;
  const hasFocused = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!hasFocused.current) {
        hasFocused.current = true;
        return;
      }
      void loadRef.current("refresh");
    }, [])
  );

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
};
