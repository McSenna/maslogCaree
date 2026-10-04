import { useCallback, useState } from "react";
import { toast } from "@/components/feedback/toast/toastStore";
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
import { toastError } from "@/utils/errorToast/toastError";

export type ActiveModal =
  | "none"
  | "add-item"
  | "edit-item"
  | "add-stock"
  | "release-stock"
  | "history";

type InventoryMutationsInput = {
  panelItem: InventoryItem | null;
  applyItemUpdate: (item: InventoryItem) => void;
  showItem: (item: InventoryItem) => void;
  reload: () => Promise<unknown>;
};

export const useInventoryMutations = ({
  panelItem,
  applyItemUpdate,
  showItem,
  reload,
}: InventoryMutationsInput) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>("none");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
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
      fallbackMessage: string,
      failureTitle: string
    ) => {
      setSubmitting(true);
      setFormError(null);
      try {
        const { item: updated, message } = await action();
        applyItemUpdate(updated);
        showItem(updated);
        closeModal();
        toast.success(message || fallbackMessage);
        await reload();
      } catch (error: unknown) {
        setPendingRelease(null);
        // The reason stays in the open form, next to what needs changing.
        setFormError(getApiErrorMessage(error, "That did not go through. Please try again."));
        toastError(failureTitle, error, { inline: true });
      } finally {
        setSubmitting(false);
      }
    },
    [applyItemUpdate, closeModal, reload, showItem]
  );

  const createItem = useCallback(
    (payload: ItemMetadataPayload) =>
      runMutation(
        () => createInventoryItem(payload),
        "Inventory item created successfully.",
        "Item not created"
      ),
    [runMutation]
  );

  const updateItem = useCallback(
    (payload: ItemMetadataPayload) => {
      if (!panelItem) return;
      return runMutation(
        () => updateInventoryItem(panelItem._id, payload),
        "Item updated successfully.",
        "Item not updated"
      );
    },
    [panelItem, runMutation]
  );

  const addItemStock = useCallback(
    (payload: StockInPayload) => {
      if (!panelItem) return;
      return runMutation(
        () => addStock(panelItem._id, payload),
        "Stock added successfully.",
        "Stock not added"
      );
    },
    [panelItem, runMutation]
  );

  const releaseItemStock = useCallback(
    (payload: StockOutPayload) => {
      if (!panelItem) return;
      return runMutation(
        () => releaseStock(panelItem._id, payload),
        "Stock released successfully.",
        "Stock not released"
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
};
