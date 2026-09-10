import { useCallback, useState } from "react";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import {
  addStock,
  createInventoryItem,
  releaseStock,
  updateInventoryItem,
  type InventoryItem,
  type ItemMetadataPayload,
  type StockInPayload,
  type StockOutPayload,
} from "../services/inventoryService";

/** Which form or sheet is open, if any. */
export type ActiveModal =
  | "none"
  | "add-item"
  | "edit-item"
  | "add-stock"
  | "release-stock"
  | "history";

type InventoryMutationsInput = {
  /** The item the open form acts on. */
  panelItem: InventoryItem | null;
  /** Patches the list row in place so the panel updates without a refetch. */
  applyItemUpdate: (item: InventoryItem) => void;
  /** Points the details panel at the record the server returned. */
  showItem: (item: InventoryItem) => void;
  /** Refetches the list once the server has confirmed the change. */
  reload: () => Promise<unknown>;
  onSuccess: (message: string) => void;
};

/**
 * Every write on this screen, and the modal state around it.
 *
 * A stock movement changes the summary counts and can move the row between
 * filtered pages, so the list is refetched rather than patched — but the
 * returned record is applied first so the panel updates without waiting.
 */
export function useInventoryMutations({
  panelItem,
  applyItemUpdate,
  showItem,
  reload,
  onSuccess,
}: InventoryMutationsInput) {
  const [activeModal, setActiveModal] = useState<ActiveModal>("none");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  /** A release awaiting confirmation, held so the dialog can state its effect. */
  const [pendingRelease, setPendingRelease] = useState<StockOutPayload | null>(null);

  const openModal = useCallback((modal: ActiveModal, item?: InventoryItem) => {
    if (item) showItem(item);
    setFormError(null);
    setActiveModal(modal);
  }, [showItem]);

  const closeModal = useCallback(() => {
    setActiveModal("none");
    setFormError(null);
    setPendingRelease(null);
  }, []);

  const runMutation = useCallback(
    async (
      action: () => Promise<{ item: InventoryItem; message: string }>,
      fallbackMessage: string
    ) => {
      setSubmitting(true);
      setFormError(null);
      try {
        const { item: updated, message } = await action();
        applyItemUpdate(updated);
        showItem(updated);
        closeModal();
        onSuccess(message || fallbackMessage);
        await reload();
      } catch (error: unknown) {
        // The form stays open so the entry can be corrected without being
        // retyped — a rejected release is usually a quantity that needs a nudge.
        // The confirmation is dismissed either way, so the error is not left
        // sitting behind a dialog the user has already answered.
        setPendingRelease(null);
        setFormError(getApiErrorMessage(error, "That did not go through. Please try again."));
      } finally {
        setSubmitting(false);
      }
    },
    [applyItemUpdate, closeModal, onSuccess, reload, showItem]
  );

  const createItem = useCallback(
    (payload: ItemMetadataPayload) =>
      runMutation(() => createInventoryItem(payload), "Inventory item created successfully."),
    [runMutation]
  );

  const updateItem = useCallback(
    (payload: ItemMetadataPayload) => {
      if (!panelItem) return;
      return runMutation(
        () => updateInventoryItem(panelItem._id, payload),
        "Item updated successfully."
      );
    },
    [panelItem, runMutation]
  );

  const addItemStock = useCallback(
    (payload: StockInPayload) => {
      if (!panelItem) return;
      return runMutation(() => addStock(panelItem._id, payload), "Stock added successfully.");
    },
    [panelItem, runMutation]
  );

  const releaseItemStock = useCallback(
    (payload: StockOutPayload) => {
      if (!panelItem) return;
      return runMutation(
        () => releaseStock(panelItem._id, payload),
        "Stock released successfully."
      );
    },
    [panelItem, runMutation]
  );

  return {
    activeModal,
    submitting,
    formError,
    pendingRelease,
    setPendingRelease,
    openModal,
    closeModal,
    createItem,
    updateItem,
    addItemStock,
    releaseItemStock,
  };
}
