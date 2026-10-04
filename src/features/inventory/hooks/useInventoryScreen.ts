import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { DENSE_WINDOW_WIDTH, INVENTORY_LAYOUT } from "../constants/inventoryLayout";
import { useInventory } from "./useInventory";
import { useInventoryMutations } from "./useInventoryMutations";
import { useInventoryQuery } from "./useInventoryQuery";
import { useInventorySelection } from "./useInventorySelection";

export const useInventoryScreen = () => {
  const { user } = useAuth();
  const insets = useRoleScreenInsets();

  const [contentWidth, setContentWidth] = useState(insets.width);
  const [tableAreaWidth, setTableAreaWidth] = useState(0);
  const [filterSheet, setFilterSheet] = useState<"filters" | "sort" | null>(null);

  // The count from the last load lets the query move a page past the end back onto the last page.
  const [listTotal, setListTotal] = useState<number | null>(null);
  const query = useInventoryQuery(listTotal);
  const data = useInventory(query.query);
  const selection = useInventorySelection(data.items);

  const mutations = useInventoryMutations({
    panelItem: selection.panelItem,
    applyItemUpdate: data.applyItemUpdate,
    showItem: selection.showItem,
    reload: data.reload,
  });

  const { loading, total } = data;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors the server's count once a load settles
    if (!loading) setListTotal(total);
  }, [loading, total]);

  const { openModal } = mutations;
  const detailsActions = useMemo(
    () => ({
      onAddStock: () => openModal("add-stock"),
      onReleaseStock: () => openModal("release-stock"),
      onEditItem: () => openModal("edit-item"),
      onViewHistory: () => openModal("history"),
    }),
    [openModal]
  );

  const measureContent = (event: { nativeEvent: { layout: { width: number } } }) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next > 0 && next !== contentWidth) setContentWidth(next);
  };

  // A page past the end (a stale link, or the last page's rows deleted) reads as loading until it
  // moves to the new last page, never as an empty inventory.
  const pastEnd = !data.loading && data.total > 0 && query.page > data.totalPages;

  return {
    user,
    insets,
    query,
    data: pastEnd ? { ...data, loading: true } : data,
    selection,
    mutations,
    detailsActions,
    filterSheet,
    setFilterSheet,
    tableAreaWidth,
    setTableAreaWidth,
    measureContent,
    showTable: contentWidth >= INVENTORY_LAYOUT.table,
    fourMetrics: contentWidth >= INVENTORY_LAYOUT.fourMetrics,
    sideBySide: contentWidth >= INVENTORY_LAYOUT.sidePanel,
    dense: insets.width < DENSE_WINDOW_WIDTH,
    contentPadding: {
      paddingHorizontal: insets.gutter,
      paddingTop: insets.paddingTop,
      paddingBottom: insets.paddingBottom,
    },
  };
};

export type InventoryScreenController = ReturnType<typeof useInventoryScreen>;
