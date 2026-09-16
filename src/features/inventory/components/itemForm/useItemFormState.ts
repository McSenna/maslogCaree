import { useEffect, useState } from "react";

import type {
  InventoryCategory,
  InventoryItem,
  ItemMetadataPayload,
  StorageCondition,
} from "@/features/inventory/services/inventoryService";

export const useItemFormState = (visible: boolean, item: InventoryItem | null) => {
  const [name, setName] = useState("");
  const [specification, setSpecification] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState<InventoryCategory>("medicine");
  const [unit, setUnit] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [storageCondition, setStorageCondition] = useState<StorageCondition>("room-temperature");
  const [supplier, setSupplier] = useState<string>("none");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!visible) return;
    setName(item?.name ?? "");
    setSpecification(item?.specification ?? "");
    setGenericName(item?.genericName ?? "");
    setCategory(item?.category ?? "medicine");
    setUnit(item?.unit ?? "");
    setReorderLevel(item ? String(item.reorderLevel) : "");
    setStorageCondition((item?.storageCondition as StorageCondition) || "room-temperature");
    setSupplier(item?.supplier?._id ?? "none");
    setDescription(item?.description ?? "");
  }, [visible, item]);

  const reorderNumber = Number(reorderLevel);
  const reorderValid =
    reorderLevel.trim() !== "" && Number.isInteger(reorderNumber) && reorderNumber >= 0;

  const complete = name.trim().length > 0 && unit.trim().length > 0 && reorderValid;

  const toPayload = (): ItemMetadataPayload => ({
    name: name.trim(),
    specification: specification.trim(),
    genericName: genericName.trim(),
    description: description.trim(),
    category,
    unit: unit.trim(),
    reorderLevel: reorderNumber,
    storageCondition,
    supplier: supplier === "none" ? null : supplier,
  });

  return {
    name,
    setName,
    specification,
    setSpecification,
    genericName,
    setGenericName,
    category,
    setCategory,
    unit,
    setUnit,
    reorderLevel,
    setReorderLevel,
    reorderValid,
    storageCondition,
    setStorageCondition,
    supplier,
    setSupplier,
    description,
    setDescription,
    complete,
    toPayload,
  };
};

export type ItemFormState = ReturnType<typeof useItemFormState>;
