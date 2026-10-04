// Which list filters each summary card stands for. The card counts ignore
// search and category, so choosing a card clears both and the list then shows
// exactly what the card counted (the server uses the same stock and expiry
// definitions for the counts and the filters).
import type { InventoryMetricKey } from "./inventoryTheme";
import type { ExpiryStatusFilter, StockStatusFilter } from "./inventoryFilters";

type CardFilters = { stockStatus: StockStatusFilter; expiryStatus: ExpiryStatusFilter };

export const CARD_FILTERS: Record<InventoryMetricKey, CardFilters> = {
  total: { stockStatus: "all", expiryStatus: "all" },
  inStock: { stockStatus: "in-stock", expiryStatus: "all" },
  lowStock: { stockStatus: "low-stock", expiryStatus: "all" },
  expiringSoon: { stockStatus: "all", expiryStatus: "expiring-soon" },
};

export const CARD_HINTS: Record<InventoryMetricKey, string> = {
  total: "Shows every item",
  inStock: "Shows items in stock",
  lowStock: "Shows items at or below their reorder level",
  expiringSoon: "Shows items expiring soon",
};

/** The card whose filters the list currently shows, or null for any other mix. */
export const activeInventoryCard = (
  filters: CardFilters & { category: string },
  search: string
): InventoryMetricKey | null => {
  if (search || filters.category !== "all") return null;
  const match = (Object.keys(CARD_FILTERS) as InventoryMetricKey[]).find(
    (key) =>
      CARD_FILTERS[key].stockStatus === filters.stockStatus &&
      CARD_FILTERS[key].expiryStatus === filters.expiryStatus
  );
  return match ?? null;
};
