import type { InventoryItem, StockOutPayload } from "@/features/inventory/services/inventoryService";
import InventoryFormModal from "./InventoryFormModal";
import ReleaseFormFields from "./releaseStock/ReleaseFormFields";
import { useReleaseStockForm } from "./releaseStock/useReleaseStockForm";

type ReleaseStockModalProps = {
  visible: boolean;
  item: InventoryItem | null;
  submitting: boolean;
  error: string | null;
  releasedByName: string;
  onSubmit: (payload: StockOutPayload) => void;
  onClose: () => void;
};

const ReleaseStockModal = ({
  visible,
  item,
  submitting,
  error,
  releasedByName,
  onSubmit,
  onClose,
}: ReleaseStockModalProps) => {
  const form = useReleaseStockForm(visible, item);

  if (!item) return null;

  return (
    <InventoryFormModal
      visible={visible}
      title="Release Stock"
      subtitle={`Record stock leaving ${item.name}.`}
      icon="external-link"
      submitLabel="Release Stock"
      submitDisabled={!form.complete}
      submitting={submitting}
      error={error}
      onSubmit={() => onSubmit(form.buildPayload())}
      onClose={onClose}
    >
      <ReleaseFormFields item={item} releasedByName={releasedByName} form={form} />
    </InventoryFormModal>
  );
};

export default ReleaseStockModal;
