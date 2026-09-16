import type {
  InventoryItem,
  InventorySupplier,
  ItemMetadataPayload,
  StockInPayload,
  StockOutPayload,
} from "../../services/inventoryService";
import type { ActiveModal } from "../../hooks/useInventoryMutations";
import AddStockModal from "../AddStockModal";
import InventoryHistoryModal from "../InventoryHistoryModal";
import ItemFormModal from "../ItemFormModal";
import ReleaseStockModal from "../ReleaseStockModal";

const InventoryFormModals = ({
  activeModal,
  panelItem,
  suppliers,
  submitting,
  formError,
  releasedByName,
  onCreateItem,
  onUpdateItem,
  onAddStock,
  onCloseModal,
  onRequestRelease,
}: {
  activeModal: ActiveModal;
  panelItem: InventoryItem | null;
  suppliers: InventorySupplier[];
  submitting: boolean;
  formError: string | null;
  releasedByName: string;
  onCreateItem: (payload: ItemMetadataPayload) => void;
  onUpdateItem: (payload: ItemMetadataPayload) => void;
  onAddStock: (payload: StockInPayload) => void;
  onCloseModal: () => void;
  onRequestRelease: (payload: StockOutPayload) => void;
}) => {
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
      <InventoryHistoryModal visible={activeModal === "history"} item={panelItem} onClose={onCloseModal} />
    </>
  );
};

export default InventoryFormModals;
