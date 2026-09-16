import { todayDateKey, shiftDateKey } from "@/utils/dateFormatter";
import type { SelectOption } from "@/components/ui/SelectMenu";
import { SUPPORTED_ID_TYPES } from "@/config/idVerification";

export type RequestStatusFilter = "pending" | "approved" | "rejected" | "all";

export const REQUEST_COLUMNS = {
  resident: 2.4,
  contact: 2.2,
  idType: 1.9,
  registered: 1.4,
  status: 1.1,
  action: 116,
} as const;

export const REQUESTS_TABLE_MIN_WIDTH = 940;

export const REQUESTS_PAGE_SIZE = 10;

export const REQUESTS_SEARCH_DEBOUNCE_MS = 350;

export const REQUEST_STATUS_OPTIONS: readonly SelectOption<RequestStatusFilter>[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All Statuses" },
];

export const ID_TYPE_FILTER_OPTIONS: readonly SelectOption<string>[] = [
  { value: "", label: "All ID Types" },
  ...SUPPORTED_ID_TYPES.map((type) => ({ value: type.id, label: type.label })),
];

export const REQUEST_DATE_PRESETS = ["all", "today", "7d", "30d"] as const;
export type RequestDatePreset = (typeof REQUEST_DATE_PRESETS)[number];

export const REQUEST_DATE_OPTIONS: readonly SelectOption<RequestDatePreset>[] = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
];

export const buildRequestDateRange = (preset: RequestDatePreset): {
  dateFrom: string;
  dateTo: string;
} => {
  const today = todayDateKey();

  switch (preset) {
    case "today":
      return { dateFrom: today, dateTo: today };
    case "7d":
      return { dateFrom: shiftDateKey(today, -6), dateTo: today };
    case "30d":
      return { dateFrom: shiftDateKey(today, -29), dateTo: today };
    case "all":
    default:
      return { dateFrom: "", dateTo: "" };
  }
};
