import api from "@/services/api";

import {
  NO_PERMISSIONS,
  type InventoryCategory,
  type InventoryItem,
  type InventoryListResult,
  type InventoryPermissions,
  type InventoryQuery,
  type InventorySummary,
  type InventorySupplier,
  type StorageCondition,
} from "../types/inventory.types";

type ListResponse = {
  success: boolean;
  items: InventoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  permissions: InventoryPermissions;
};

export const fetchInventoryItems = async (query: InventoryQuery): Promise<InventoryListResult> => {
  const { data } = await api.get<ListResponse>("/inventory/items", { params: query });
  return {
    items: data.items ?? [],
    total: data.total ?? 0,
    page: data.page ?? 1,
    limit: data.limit ?? 8,
    totalPages: data.totalPages ?? 1,
    permissions: data.permissions ?? NO_PERMISSIONS,
  };
};

export const fetchInventoryItem = async (itemId: string): Promise<InventoryItem> => {
  const { data } = await api.get<{ item: InventoryItem }>(`/inventory/items/${itemId}`);
  return data.item;
};

export const fetchInventorySummary = async (): Promise<InventorySummary> => {
  const { data } = await api.get<{ summary: InventorySummary }>("/inventory/summary");
  return data.summary;
};

export const fetchSuppliers = async (): Promise<InventorySupplier[]> => {
  const { data } = await api.get<{ suppliers: InventorySupplier[] }>("/inventory/suppliers");
  return data.suppliers ?? [];
};

export type ItemMetadataPayload = {
  name: string;
  specification?: string;
  genericName?: string;
  description?: string;
  category: InventoryCategory;
  unit: string;
  reorderLevel: number;
  storageCondition?: StorageCondition;
  supplier?: string | null;
};

export const createInventoryItem = async (
  payload: ItemMetadataPayload
): Promise<{ item: InventoryItem; message: string }> => {
  const { data } = await api.post<{ item: InventoryItem; message: string }>(
    "/inventory/items",
    payload
  );
  return { item: data.item, message: data.message };
};

export const updateInventoryItem = async (
  itemId: string,
  payload: Partial<ItemMetadataPayload>
): Promise<{ item: InventoryItem; message: string }> => {
  const { data } = await api.patch<{ item: InventoryItem; message: string }>(
    `/inventory/items/${itemId}`,
    payload
  );
  return { item: data.item, message: data.message };
};
