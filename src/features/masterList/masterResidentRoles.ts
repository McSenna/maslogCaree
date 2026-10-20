import type { MasterResidentRole } from "./masterList.types.ts";

export const MASTER_ROLE_CHOICES = [
  { value: "resident", label: "Resident" },
  { value: "bhw", label: "BHW" },
  { value: "midwife", label: "Midwife" },
] as const;

export const masterRoleLabel = (role?: MasterResidentRole | null) =>
  MASTER_ROLE_CHOICES.find((option) => option.value === role)?.label ?? "Resident";
