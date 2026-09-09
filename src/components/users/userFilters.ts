import type { AdminUser, UserStatus } from "@/services/userService";
import type { SelectOption } from "./SelectMenu";

export type RoleFilter = AdminUser["role"] | "all";
export type StatusFilter = UserStatus | "all";

export type SortKey =
  | "lastLogin_desc"
  | "lastLogin_asc"
  | "name_asc"
  | "name_desc"
  | "created_desc"
  | "created_asc";

export const ROLE_FILTER_OPTIONS: readonly SelectOption<RoleFilter>[] = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "doctor", label: "Doctor" },
  { value: "midwife", label: "Midwife" },
  { value: "bhw", label: "BHW" },
  { value: "resident", label: "Resident" },
];

export const STATUS_FILTER_OPTIONS: readonly SelectOption<StatusFilter>[] = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

export const SORT_OPTIONS: readonly SelectOption<SortKey>[] = [
  { value: "lastLogin_desc", label: "Last Login (Newest)" },
  { value: "lastLogin_asc", label: "Last Login (Oldest)" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
  { value: "created_desc", label: "Date Added (Newest)" },
  { value: "created_asc", label: "Date Added (Oldest)" },
];
