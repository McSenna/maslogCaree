import type { ListSchema } from "../../lib/listState/listStateCodec.ts";
import type { MasterListRoleFilter, MasterCivilStatusFilter } from "./masterList.types.ts";
import { CIVIL_STATUS_CHOICES, PUROK_CHOICES } from "./masterResidentForm.ts";
import { MASTER_ROLE_CHOICES } from "./masterResidentRoles.ts";

export type MasterListFilters = { role: MasterListRoleFilter; civilStatus: MasterCivilStatusFilter; purok: string };
export const MASTER_PAGE_SIZE = 20;

export const MASTER_ROLE_FILTER_OPTIONS = [
  { value: "all", label: "All roles" },
  ...MASTER_ROLE_CHOICES,
] as const;

export const MASTER_CIVIL_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All civil statuses" },
  ...CIVIL_STATUS_CHOICES,
] as const;

export const MASTER_PUROK_FILTER_OPTIONS = [
  { value: "all", label: "All puroks" },
  ...PUROK_CHOICES,
] as const;

// The account list shares this route, so every Master List filter has its own name.
export const MASTER_LIST_SCHEMA: ListSchema<MasterListFilters> = {
  fields: {
    role: { kind: "enum", values: MASTER_ROLE_FILTER_OPTIONS.map((option) => option.value), fallback: "all", param: "mrole" },
    civilStatus: { kind: "enum", values: MASTER_CIVIL_STATUS_FILTER_OPTIONS.map((option) => option.value), fallback: "all", param: "mcivil" },
    purok: { kind: "enum", values: MASTER_PUROK_FILTER_OPTIONS.map((option) => option.value), fallback: "all", param: "mpurok" },
  },
  limits: [MASTER_PAGE_SIZE],
  pageParam: "mpage",
};
