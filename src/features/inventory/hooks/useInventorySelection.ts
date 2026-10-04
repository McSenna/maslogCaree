import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "@/components/feedback/toast/toastStore";
import { useRealtimeItem } from "@/hooks/realtime/useRealtimeItem";
import { fetchInventoryItem, type InventoryItem } from "../services/inventoryService";

export const useInventorySelection = (items: InventoryItem[]) => {
  const [checkedIds, setCheckedIds] = useState<ReadonlySet<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // What the panel shows until the full record (with batches) arrives: the table
  // row, or the item a save just returned.
  const [preview, setPreview] = useState<InventoryItem | null>(null);
  // The detail carries batches the table row lacks, so a change reloads it.
  const detail = useRealtimeItem("inventoryItem", selectedId, fetchInventoryItem);

  const selectedRow = useMemo(
    () => items.find((item) => item._id === selectedId) ?? null,
    [items, selectedId]
  );

  // A removed item keeps its last copy on screen: an open edit form must not
  // turn into an empty "new item" form under the user.
  const panelItem = detail.item ?? (preview?._id === selectedId ? preview : selectedRow);

  useEffect(() => {
    if (detail.deleted) toast.info("This item was deactivated", "It is no longer in the active inventory.");
  }, [detail.deleted]);

  const selectItem = useCallback((item: InventoryItem) => {
    setSelectedId(item._id);
    setPreview(item);
  }, []);

  const closeDetails = useCallback(() => {
    setSelectedId(null);
    setPreview(null);
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

  const { mutate } = detail;
  const showItem = useCallback(
    (item: InventoryItem) => {
      setPreview(item);
      setSelectedId(item._id);
      mutate((current) => ({ ...current, ...item }));
    },
    [mutate]
  );

  return {
    checkedIds,
    selectedId,
    panelItem,
    detailLoading: detail.loading,
    selectItem,
    closeDetails,
    toggleItem,
    toggleAllOnPage,
    showItem,
  };
};
