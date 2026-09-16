import ConfirmationModal from "@/components/ui/ConfirmationModal";
import type { InventoryItem, StockOutPayload } from "../../services/inventoryService";

const ReleaseConfirmationModal = ({
  pendingRelease,
  panelItem,
  submitting,
  onConfirm,
  onCancel,
}: {
  pendingRelease: StockOutPayload | null;
  panelItem: InventoryItem | null;
  submitting: boolean;
  onConfirm: (payload: StockOutPayload) => void;
  onCancel: () => void;
}) => (
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
      if (pendingRelease) onConfirm(pendingRelease);
    }}
    onCancel={onCancel}
  />
);

export default ReleaseConfirmationModal;
