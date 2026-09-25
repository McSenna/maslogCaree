import { useEffect, useMemo, useState } from "react";
import { notifyToast } from "@/components/feedback/toast/toastStore";
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

  const query = useInventoryQuery();
  const data = useInventory(query.query);
  const selection = useInventorySelection(data.items);

  const mutations = useInventoryMutations({
    panelItem: selection.panelItem,
    applyItemUpdate: data.applyItemUpdate,
    showItem: selection.showItem,
    reload: data.reload,
    onSuccess: (message) => notifyToast(message),
  });

  const { clampPage } = query;
  const { totalPages } = data;
  useEffect(() => {
    clampPage(totalPages);
  }, [totalPages, clampPage]);

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

  return {
    user,
    insets,
    query,
    data,
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
