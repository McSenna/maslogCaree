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
import InventoryDetailsSheet from "./InventoryDetailsSheet";
import InventoryFilterSheet from "./InventoryFilterSheet";
import InventoryFormModals from "./overlays/InventoryFormModals";
import ReleaseConfirmationModal from "./overlays/ReleaseConfirmationModal";

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
  showDetailsSheet: boolean;
  onCloseDetails: () => void;
  filterSheet: "filters" | "sort" | null;
  filters: InventoryFilterState;
  onApplyFilters: (next: InventoryFilterState) => void;
  onCloseFilterSheet: () => void;
};

const InventoryOverlays = ({
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
}: InventoryOverlaysProps) => {
  return (
    <>
      <InventoryFormModals
        activeModal={activeModal}
        panelItem={panelItem}
        suppliers={suppliers}
        submitting={submitting}
        formError={formError}
        releasedByName={releasedByName}
        onCreateItem={onCreateItem}
        onUpdateItem={onUpdateItem}
        onAddStock={onAddStock}
        onCloseModal={onCloseModal}
        onRequestRelease={onRequestRelease}
      />

      <ReleaseConfirmationModal
        pendingRelease={pendingRelease}
        panelItem={panelItem}
        submitting={submitting}
        onConfirm={onConfirmRelease}
        onCancel={onCancelRelease}
      />

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

    </>
  );
};

export default InventoryOverlays;
