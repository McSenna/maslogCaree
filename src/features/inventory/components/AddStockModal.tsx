import type {
  InventoryItem,
  InventorySupplier,
  StockInPayload,
} from "@/features/inventory/services/inventoryService";

import AddStockFields from "./addStock/AddStockFields";
import { useAddStockState } from "./addStock/useAddStockState";
import InventoryFormModal from "./InventoryFormModal";

type AddStockModalProps = {
  visible: boolean;
  item: InventoryItem | null;
  suppliers: InventorySupplier[];
  submitting: boolean;
  error: string | null;
  onSubmit: (payload: StockInPayload) => void;
  onClose: () => void;
};

const AddStockModal = ({
  visible,
  item,
  suppliers,
  submitting,
  error,
  onSubmit,
  onClose,
}: AddStockModalProps) => {
  const form = useAddStockState(visible, item);

  if (!item) return null;

  return (
    <InventoryFormModal
      visible={visible}
      title="Add Stock"
      subtitle={`Receive a new batch into ${item.name}.`}
      icon="plus"
      submitLabel="Add Stock"
      submitDisabled={!form.complete}
      submitting={submitting}
      error={error}
      onSubmit={() => onSubmit(form.toPayload())}
      onClose={onClose}
    >
      <AddStockFields form={form} item={item} suppliers={suppliers} />
    </InventoryFormModal>
  );
};

export default AddStockModal;
