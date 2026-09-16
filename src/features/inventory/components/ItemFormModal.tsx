import type {
  InventoryItem,
  InventorySupplier,
  ItemMetadataPayload,
} from "@/features/inventory/services/inventoryService";

import InventoryFormModal from "./InventoryFormModal";
import ItemFormFields from "./itemForm/ItemFormFields";
import { useItemFormState } from "./itemForm/useItemFormState";

type ItemFormModalProps = {
  visible: boolean;
  item: InventoryItem | null;
  suppliers: InventorySupplier[];
  submitting: boolean;
  error: string | null;
  onSubmit: (payload: ItemMetadataPayload) => void;
  onClose: () => void;
};

const ItemFormModal = ({
  visible,
  item,
  suppliers,
  submitting,
  error,
  onSubmit,
  onClose,
}: ItemFormModalProps) => {
  const isEdit = item !== null;
  const form = useItemFormState(visible, item);

  return (
    <InventoryFormModal
      visible={visible}
      title={isEdit ? "Edit Item" : "Add Inventory Item"}
      subtitle={
        isEdit
          ? "Update this item's details. Stock quantity is changed through Add Stock or Release Stock."
          : "Create the item first, then receive its stock through Add Stock."
      }
      icon={isEdit ? "edit-2" : "plus-square"}
      submitLabel={isEdit ? "Save Changes" : "Create Item"}
      submitDisabled={!form.complete}
      submitting={submitting}
      error={error}
      onSubmit={() => onSubmit(form.toPayload())}
      onClose={onClose}
    >
      <ItemFormFields
        form={form}
        suppliers={suppliers}
        isEdit={isEdit}
        currentStock={item?.currentStock}
        unit={item?.unit}
      />
    </InventoryFormModal>
  );
};

export default ItemFormModal;
