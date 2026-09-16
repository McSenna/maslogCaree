import api from "@/services/api";

import type {
  InventoryItem,
  InventoryTransactionEntry,
  StorageCondition,
  TransactionType,
} from "../types/inventory.types";

export type StockInPayload = {
  quantity: number;
  batchNumber: string;
  expiryDate?: string | null;
  supplier?: string | null;
  source?: string;
  receivedDate?: string;
  storageCondition?: StorageCondition;
  remarks?: string;
};

export const addStock = async (
  itemId: string,
  payload: StockInPayload
): Promise<{ item: InventoryItem; message: string }> => {
  const { data } = await api.post<{ item: InventoryItem; message: string }>(
    `/inventory/items/${itemId}/stock-in`,
    payload
  );
  return { item: data.item, message: data.message };
};

export type StockOutPayload = {
  quantity: number;
  reason: string;
  recipient?: string;
  relatedPatient?: string | null;
  relatedAppointment?: string | null;
  remarks?: string;
  type?: Extract<TransactionType, "STOCK_OUT" | "EXPIRED" | "DAMAGED" | "TRANSFER" | "ADJUSTMENT">;
};

export const releaseStock = async (
  itemId: string,
  payload: StockOutPayload
): Promise<{ item: InventoryItem; message: string }> => {
  const { data } = await api.post<{ item: InventoryItem; message: string }>(
    `/inventory/items/${itemId}/stock-out`,
    payload
  );
  return { item: data.item, message: data.message };
};

export type HistoryResult = {
  history: InventoryTransactionEntry[];
  total: number;
  page: number;
  totalPages: number;
};

export const fetchItemHistory = async (itemId: string, page = 1): Promise<HistoryResult> => {
  const { data } = await api.get<HistoryResult>(`/inventory/items/${itemId}/history`, {
    params: { page, limit: 20 },
  });
  return {
    history: data.history ?? [],
    total: data.total ?? 0,
    page: data.page ?? 1,
    totalPages: data.totalPages ?? 1,
  };
};
