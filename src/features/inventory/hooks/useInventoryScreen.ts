import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { DENSE_WINDOW_WIDTH, INVENTORY_LAYOUT } from "../constants/inventoryLayout";
import { useInventory } from "./useInventory";
import { useInventoryMutations } from "./useInventoryMutations";
import { useInventoryQuery } from "./useInventoryQuery";
import { useInventorySelection } from "./useInventorySelection";

/**
 * The Inventory screen's whole data and layout layer.
 *
 * Composed from four narrower hooks — what is being asked for, what came back,
 * what is selected, and what is being written — so each stays readable on its
 * own. The screen and its two layouts render from this and hold no state of
 * their own beyond measurement.
 */
export function useInventoryScreen() {
  const { user } = useAuth();
  const insets = useRoleScreenInsets();
  const { toast, showToast, hideToast } = useToast();

  // Measured content width, seeded from the window so the first paint is not a
  // phone layout on a desktop; replaced by the real figure on layout.
  const [contentWidth, setContentWidth] = useState(insets.width);
  const [tableAreaWidth, setTableAreaWidth] = useState(0);
  /** Which phone sheet is open — the filter half, the sort half, or neither. */
  const [filterSheet, setFilterSheet] = useState<"filters" | "sort" | null>(null);

  const query = useInventoryQuery();
  const data = useInventory(query.query);
  const selection = useInventorySelection(data.items);

  const mutations = useInventoryMutations({
    panelItem: selection.panelItem,
    applyItemUpdate: data.applyItemUpdate,
    showItem: selection.showItem,
    reload: data.reload,
    onSuccess: (message) => showToast(message, "success"),
  });

  const { clampPage } = query;
  const { totalPages } = data;
  useEffect(() => {
    clampPage(totalPages);
  }, [totalPages, clampPage]);

  /**
   * The four actions, wherever Item Details is presented.
   *
   * Neither the table nor the mobile card carries its own action control any
   * more: selecting an item is the single entry point, and these are the
   * buttons the panel or sheet then draws — filtered by permission inside
   * `InventoryActions`, and re-checked by the server on every call.
   */
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
    toast,
    hideToast,
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
    /** The table replaces the card list. */
    showTable: contentWidth >= INVENTORY_LAYOUT.table,
    /** Four metric cards across instead of a 2x2 grid. */
    fourMetrics: contentWidth >= INVENTORY_LAYOUT.fourMetrics,
    /** The details panel sits beside the table instead of below it. */
    sideBySide: contentWidth >= INVENTORY_LAYOUT.sidePanel,
    /** Narrowest phones — trims the icon, keeps the grid. */
    dense: insets.width < DENSE_WINDOW_WIDTH,
    contentPadding: {
      paddingHorizontal: insets.gutter,
      paddingTop: insets.paddingTop,
      paddingBottom: insets.paddingBottom,
    },
  };
}

export type InventoryScreenController = ReturnType<typeof useInventoryScreen>;
