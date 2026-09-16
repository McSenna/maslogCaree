import type { SelectOption } from "@/components/ui/SelectMenu";

export type ResidentStatusFilter = "all" | "active" | "inactive" | "pending" | "suspended";

export type ResidentSortKey = "created_desc" | "created_asc" | "name_asc" | "name_desc";

export const RESIDENT_STATUS_OPTIONS: readonly SelectOption<ResidentStatusFilter>[] = [
  { value: "all", label: "All Residents" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
];

export const RESIDENT_SORT_OPTIONS: readonly SelectOption<ResidentSortKey>[] = [
  { value: "created_desc", label: "Newest Registered" },
  { value: "created_asc", label: "Oldest Registered" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
];
