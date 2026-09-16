export type InventoryCategory =
  | "medicine"
  | "vaccine"
  | "supply"
  | "equipment"
  | "maternal"
  | "other";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export type ExpiryStatus = "normal" | "expiring-soon" | "urgent" | "expired" | "none";

export type TransactionType =
  | "STOCK_IN"
  | "STOCK_OUT"
  | "ADJUSTMENT"
  | "EXPIRED"
  | "DAMAGED"
  | "RETURNED"
  | "TRANSFER";

export type StorageCondition =
  | "room-temperature"
  | "refrigerated"
  | "frozen"
  | "dry-storage"
  | "controlled";

export type InventorySupplier = { _id: string; name: string; type?: string };

export type InventoryBatch = {
  _id: string;
  batchNumber: string;
  quantityReceived: number;
  quantityRemaining: number;
  expiryDate: string | null;
  receivedDate: string | null;
  storageCondition: string;
  status: "active" | "depleted" | "expired" | "quarantined";
  expiryStatus: ExpiryStatus;
  daysUntilExpiry: number | null;
  supplier: InventorySupplier | null;
};

export type InventoryItem = {
  _id: string;
  name: string;
  specification: string;
  genericName: string;
  description: string;
  category: InventoryCategory;
  unit: string;
  reorderLevel: number;
  currentStock: number;
  storageCondition: string;
  supplier: InventorySupplier | null;
  nearestExpiry: string | null;
  lastRestockedAt: string | null;
  isActive: boolean;
  stockStatus: StockStatus;
  expiryStatus: ExpiryStatus;
  daysUntilExpiry: number | null;
  batchNumber?: string;
  batches?: InventoryBatch[];
  createdAt: string;
  updatedAt: string;
};

export type InventoryTransactionEntry = {
  _id: string;
  type: TransactionType;
  quantity: number;
  previousStock: number;
  newStock: number;
  batchNumber: string;
  reason: string;
  source: string;
  recipient: string;
  notes: string;
  performedByName: string;
  performedByRole: string;
  createdAt: string;
};

export type InventoryPermissions = {
  view: boolean;
  create: boolean;
  edit: boolean;
  stockIn: boolean;
  stockOut: boolean;
  history: boolean;
  deactivate: boolean;
};

export const NO_PERMISSIONS: InventoryPermissions = {
  view: false,
  create: false,
  edit: false,
  stockIn: false,
  stockOut: false,
  history: false,
  deactivate: false,
};

export type InventoryMetric = { value: number; growth: number | null };

export type InventorySummary = {
  total: InventoryMetric;
  inStock: InventoryMetric;
  lowStock: InventoryMetric;
  expiringSoon: InventoryMetric;
  outOfStock: InventoryMetric;
  expired: InventoryMetric;
};

export type InventorySortKey =
  | "updated_desc"
  | "updated_asc"
  | "name_asc"
  | "name_desc"
  | "stock_asc"
  | "stock_desc"
  | "expiry_asc"
  | "expiry_desc";

export type InventoryQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: InventoryCategory | "all";
  stockStatus?: StockStatus | "all";
  expiryStatus?: ExpiryStatus | "all";
  sort?: InventorySortKey;
};

export type InventoryListResult = {
  items: InventoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  permissions: InventoryPermissions;
};
