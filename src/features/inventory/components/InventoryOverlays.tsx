import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Toast, { type ToastState } from "@/components/ui/Toast";
import type { InventoryActionHandlers } from "./InventoryActions";
import type { InventoryFilterState } from "./InventoryFilterSheet";
import type {
  InventoryItem,
  InventoryPermissions,
  InventorySupplier,
  ItemMetadataPayload,
  StockInPayload,
  StockOutPayload,
} from "../services/inventoryService";
import type { ActiveModal } from "../hooks/useInventoryMutations";
import AddStockModal from "./AddStockModal";
import InventoryDetailsSheet from "./InventoryDetailsSheet";
import InventoryFilterSheet from "./InventoryFilterSheet";
import InventoryHistoryModal from "./InventoryHistoryModal";
import ItemFormModal from "./ItemFormModal";
import ReleaseStockModal from "./ReleaseStockModal";

type InventoryOverlaysProps = {
  activeModal: ActiveModal;
  panelItem: InventoryItem | null;
  suppliers: InventorySupplier[];
  permissions: InventoryPermissions;
  submitting: boolean;
  formError: string | null;
  detailLoading: boolean;
  releasedByName: string;
  detailsActions: InventoryActionHandlers;
  onCreateItem: (payload: ItemMetadataPayload) => void;
  onUpdateItem: (payload: ItemMetadataPayload) => void;
  onAddStock: (payload: StockInPayload) => void;
  onCloseModal: () => void;
  pendingRelease: StockOutPayload | null;
  onRequestRelease: (payload: StockOutPayload) => void;
  onCancelRelease: () => void;
  onConfirmRelease: (payload: StockOutPayload) => void;
  /** True on a phone, where the details are a sheet rather than a column. */
  showDetailsSheet: boolean;
  onCloseDetails: () => void;
  filterSheet: "filters" | "sort" | null;
  filters: InventoryFilterState;
  onApplyFilters: (next: InventoryFilterState) => void;
  onCloseFilterSheet: () => void;
  toast: ToastState;
  onHideToast: () => void;
};

/** Everything that floats above the page: forms, sheets, confirmation, toast. */
export default function InventoryOverlays({
  activeModal,
  panelItem,
  suppliers,
  permissions,
  submitting,
  formError,
  detailLoading,
  releasedByName,
  detailsActions,
  onCreateItem,
  onUpdateItem,
  onAddStock,
  onCloseModal,
  pendingRelease,
  onRequestRelease,
  onCancelRelease,
  onConfirmRelease,
  showDetailsSheet,
  onCloseDetails,
  filterSheet,
  filters,
  onApplyFilters,
  onCloseFilterSheet,
  toast,
  onHideToast,
}: InventoryOverlaysProps) {
  const isEditing = activeModal === "edit-item";

  return (
    <>
      <ItemFormModal
        visible={activeModal === "add-item" || isEditing}
        item={isEditing ? panelItem : null}
        suppliers={suppliers}
        submitting={submitting}
        error={formError}
        onSubmit={isEditing ? onUpdateItem : onCreateItem}
        onClose={onCloseModal}
      />
      <AddStockModal
        visible={activeModal === "add-stock"}
        item={panelItem}
        suppliers={suppliers}
        submitting={submitting}
        error={formError}
        onSubmit={onAddStock}
        onClose={onCloseModal}
      />
      <ReleaseStockModal
        visible={activeModal === "release-stock"}
        item={panelItem}
        submitting={submitting}
        error={formError}
        releasedByName={releasedByName}
        onSubmit={onRequestRelease}
        onClose={onCloseModal}
      />
      <InventoryHistoryModal
        visible={activeModal === "history"}
        item={panelItem}
        onClose={onCloseModal}
      />

      {/* Releasing stock is the one action here that cannot be undone from the
          UI, so it states its arithmetic before it happens. */}
      <ConfirmationModal
        visible={pendingRelease !== null}
        title={
          pendingRelease && panelItem
            ? `Release ${pendingRelease.quantity.toLocaleString()} ${panelItem.unit}?`
            : ""
        }
        message={
          pendingRelease && panelItem
            ? `This will reduce ${panelItem.name} from ${panelItem.currentStock.toLocaleString()} to ${(panelItem.currentStock - pendingRelease.quantity).toLocaleString()} ${panelItem.unit}.`
            : ""
        }
        confirmLabel="Confirm Release"
        destructive
        loading={submitting}
        onConfirm={() => {
          if (pendingRelease) onConfirmRelease(pendingRelease);
        }}
        onCancel={onCancelRelease}
      />

      {/* Phone-only sheets. Both are modals, so they sit above the bottom nav
          rather than being scrolled past inside the list. */}
      <InventoryDetailsSheet
        visible={showDetailsSheet}
        item={panelItem}
        permissions={permissions}
        loading={detailLoading}
        onClose={onCloseDetails}
        handlers={detailsActions}
      />
      <InventoryFilterSheet
        visible={filterSheet !== null}
        mode={filterSheet ?? "filters"}
        value={filters}
        onApply={onApplyFilters}
        onClose={onCloseFilterSheet}
      />

      <Toast toast={toast} onDismiss={onHideToast} />
    </>
  );
}
