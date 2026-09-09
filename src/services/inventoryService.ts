import api from "@/services/api";

export type InventoryCategory =
  | "medicine"
  | "vaccine"
  | "supply"
  | "equipment"
  | "maternal"
  | "other";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

/** `none` is a real state (equipment does not expire), not a missing value. */
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
  /** Dosage or packaging, shown under the name — "Tablet", "0.5 mL (Adult)". */
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
  /** Derived by the server from stock vs. reorder level — never set by hand. */
  stockStatus: StockStatus;
  expiryStatus: ExpiryStatus;
  daysUntilExpiry: number | null;
  /** The lot the next release would draw from under FEFO. */
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

/**
 * What the signed-in role may do, as the server decides it.
 *
 * The client mirrors this to avoid drawing buttons that would be refused, but
 * it is the server's copy that is authoritative — this is only ever used to
 * hide affordances, never to permit an action.
 */
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

/** Types that raise the stock level — the history list signs the quantity by this. */
export const INCREASING_TRANSACTION_TYPES: TransactionType[] = ["STOCK_IN", "RETURNED"];

/**
 * The badge an item shows in the Status column.
 *
 * One badge has to stand for two independent facts, so the order is by how
 * soon the stock stops being usable:
 *
 *  1. Expired — the stock cannot be released at all.
 *  2. Out of stock — nothing to release, and nothing left to expire.
 *  3. Expiring soon — usable now, but on a deadline, which is the more
 *     actionable fact than a shelf that is merely low.
 *  4. Low stock, then In stock.
 *
 * The Low Stock metric card counts every item at or below its reorder level
 * regardless of this ordering, so an item badged "Expiring Soon" is still
 * counted there — the card is a stock question, the badge is a triage answer.
 */
export function resolveDisplayStatus(item: InventoryItem): StockStatus | "expiring-soon" | "expired" {
  if (item.expiryStatus === "expired") return "expired";
  if (item.stockStatus === "out-of-stock") return "out-of-stock";
  if (item.expiryStatus === "expiring-soon" || item.expiryStatus === "urgent") return "expiring-soon";
  if (item.stockStatus === "low-stock") return "low-stock";
  return "in-stock";
}

export type DisplayStatusKey = StockStatus | "expiring-soon" | "expired";

/**
 * Every status worth showing, not just the most urgent one.
 *
 * Low stock and a near expiry are independent facts and both change what a
 * health worker does — a shelf that is nearly empty *and* nearly out of date
 * needs reordering, not just using up. Where there is room for more than one
 * badge (the mobile card, the details summary) both are shown; the desktop
 * table's single Status column still uses `resolveDisplayStatus`.
 *
 * Ordered most-urgent first, and capped implicitly by the states that can
 * co-occur: "expired" and "out of stock" each make the other badges moot.
 */
export function resolveStatusBadges(item: InventoryItem): DisplayStatusKey[] {
  if (item.expiryStatus === "expired") return ["expired"];
  if (item.stockStatus === "out-of-stock") return ["out-of-stock"];

  const badges: DisplayStatusKey[] = [];
  if (item.stockStatus === "low-stock") badges.push("low-stock");
  if (item.expiryStatus === "expiring-soon" || item.expiryStatus === "urgent") {
    badges.push("expiring-soon");
  }
  return badges.length ? badges : ["in-stock"];
}

/**
 * Capability names, as the rest of the app should ask about them.
 *
 * A screen asks `can(permissions, "inventory.add_stock")` rather than testing a
 * role name, so adding a role is a server-side change and never a hunt through
 * the UI for `role === "admin"`.
 */
export type InventoryCapability =
  | "inventory.view"
  | "inventory.create"
  | "inventory.edit"
  | "inventory.add_stock"
  | "inventory.release_stock"
  | "inventory.view_history"
  | "inventory.archive";

const CAPABILITY_FIELDS: Record<InventoryCapability, keyof InventoryPermissions> = {
  "inventory.view": "view",
  "inventory.create": "create",
  "inventory.edit": "edit",
  "inventory.add_stock": "stockIn",
  "inventory.release_stock": "stockOut",
  "inventory.view_history": "history",
  "inventory.archive": "deactivate",
};

/**
 * Whether the signed-in role may do something.
 *
 * Reads the permission set the server sent with the list response — the client
 * never derives this from a role name, and the server re-checks every call, so
 * this only ever decides whether to *draw* a control.
 */
export function can(
  permissions: InventoryPermissions | null | undefined,
  capability: InventoryCapability
): boolean {
  if (!permissions) return false;
  return Boolean(permissions[CAPABILITY_FIELDS[capability]]);
}
