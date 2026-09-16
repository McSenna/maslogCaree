import type {
  ExpiryStatus,
  InventoryCategory,
  StockStatus,
  StorageCondition,
  TransactionType,
} from "../types/inventory.types";

export const CATEGORY_LABELS: Record<InventoryCategory, string> = {
  medicine: "Medicine",
  vaccine: "Vaccine",
  supply: "Supply",
  equipment: "Equipment",
  maternal: "Maternal Health",
  other: "Other",
};

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
};

export const EXPIRY_STATUS_LABELS: Record<ExpiryStatus, string> = {
  normal: "Normal",
  "expiring-soon": "Expiring Soon",
  urgent: "Expiring Soon",
  expired: "Expired",
  none: "No Expiry",
};

export const STORAGE_CONDITION_LABELS: Record<StorageCondition, string> = {
  "room-temperature": "Room Temperature",
  refrigerated: "Refrigerated (2°C – 8°C)",
  frozen: "Frozen",
  "dry-storage": "Dry Storage",
  controlled: "Controlled Substance Storage",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  STOCK_IN: "Stock In",
  STOCK_OUT: "Stock Out",
  ADJUSTMENT: "Adjustment",
  EXPIRED: "Expired",
  DAMAGED: "Damaged",
  RETURNED: "Returned",
  TRANSFER: "Transfer",
};

export const INCREASING_TRANSACTION_TYPES: TransactionType[] = ["STOCK_IN", "RETURNED"];
