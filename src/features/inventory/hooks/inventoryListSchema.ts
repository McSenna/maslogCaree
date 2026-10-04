import type { ListSchema } from "@/lib/listState/listStateCodec";

import type { InventoryFilterState } from "../components/InventoryFilterSheet";
import {
  CATEGORY_FILTER_OPTIONS,
  EXPIRY_STATUS_FILTER_OPTIONS,
  SORT_OPTIONS,
  STOCK_STATUS_FILTER_OPTIONS,
} from "../components/inventoryFilters";
import { DEFAULT_FILTERS } from "../components/filterSheet/filterSheetState";
import { PAGE_SIZE } from "../constants/inventoryLayout";

const valuesOf = (options: readonly { value: string }[]) => options.map((option) => option.value);

/** What the inventory table keeps in its URL; the search box is kept apart (it can hold a name). */
export const INVENTORY_LIST_SCHEMA: ListSchema<InventoryFilterState> = {
  fields: {
    category: { kind: "enum", values: valuesOf(CATEGORY_FILTER_OPTIONS), fallback: DEFAULT_FILTERS.category },
    stockStatus: { kind: "enum", values: valuesOf(STOCK_STATUS_FILTER_OPTIONS), fallback: DEFAULT_FILTERS.stockStatus, param: "stock" },
    expiryStatus: { kind: "enum", values: valuesOf(EXPIRY_STATUS_FILTER_OPTIONS), fallback: DEFAULT_FILTERS.expiryStatus, param: "expiry" },
    sort: { kind: "enum", values: valuesOf(SORT_OPTIONS), fallback: DEFAULT_FILTERS.sort },
  },
  limits: [PAGE_SIZE],
};
