import { useCallback, useMemo, useState } from "react";
import { fetchInventoryItem, type InventoryItem } from "../services/inventoryService";

export const useInventorySelection = (items: InventoryItem[]) => {
  const [checkedIds, setCheckedIds] = useState<ReadonlySet<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const selectedRow = useMemo(
    () => items.find((item) => item._id === selectedId) ?? null,
    [items, selectedId]
  );

  const panelItem = detailItem?._id === selectedId ? detailItem : selectedRow;

  const loadDetail = useCallback(async (itemId: string) => {
    setDetailLoading(true);
    try {
      setDetailItem(await fetchInventoryItem(itemId));
    } catch {
      setDetailItem(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const selectItem = useCallback(
    (item: InventoryItem) => {
      setSelectedId(item._id);
      setDetailItem(item);
      void loadDetail(item._id);
    },
    [loadDetail]
  );

  const closeDetails = useCallback(() => {
    setSelectedId(null);
    setDetailItem(null);
  }, []);

  const toggleItem = useCallback((itemId: string, next: boolean) => {
    setCheckedIds((previous) => {
      const draft = new Set(previous);
      if (next) draft.add(itemId);
      else draft.delete(itemId);
      return draft;
    });
  }, []);

  const toggleAllOnPage = useCallback(
    (next: boolean) => {
      setCheckedIds((previous) => {
        const draft = new Set(previous);
        items.forEach((item) => (next ? draft.add(item._id) : draft.delete(item._id)));
        return draft;
      });
    },
    [items]
  );

  const showItem = useCallback((item: InventoryItem) => {
    setDetailItem(item);
    setSelectedId(item._id);
  }, []);

  return {
    checkedIds,
    selectedId,
    panelItem,
    detailLoading,
    selectItem,
    closeDetails,
    toggleItem,
    toggleAllOnPage,
    showItem,
  };
};
