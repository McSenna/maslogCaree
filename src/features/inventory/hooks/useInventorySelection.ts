import { useCallback, useMemo, useState } from "react";
import { fetchInventoryItem, type InventoryItem } from "../services/inventoryService";

/**
 * Which row is open, which rows are ticked, and the fuller record behind the
 * open one.
 *
 * Selecting shows the row the list already has and swaps in the detailed
 * record when it lands, so opening the panel never blocks on a request.
 */
export function useInventorySelection(items: InventoryItem[]) {
  const [checkedIds, setCheckedIds] = useState<ReadonlySet<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** The selected row, enriched with its batches by the detail request. */
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
      // The list row is already on screen and carries every field the panel
      // needs except the batch breakdown, so a failure here is not worth an
      // error state of its own.
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

  /** Points the panel at a record a mutation just returned. */
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
}
