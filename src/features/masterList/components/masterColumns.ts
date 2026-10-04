/** Column widths shared by the master list heading band and its rows. */
export const MASTER_COLUMN = {
  resident: "min-w-[180px] flex-[1.4]",
  birth: "w-[110px] shrink-0",
  sex: "w-[70px] shrink-0",
  civil: "w-[90px] shrink-0",
  address: "min-w-0 flex-[1.2]",
  account: "w-[120px] shrink-0",
  status: "w-[100px] shrink-0",
  actions: "w-[200px] shrink-0 items-end",
} as const;

/**
 * Follows the measured content width, as the users table does:
 * - full: every column.
 * - laptop: the address folds under the name.
 * - tablet: birth date, sex and civil status fold under the name too, so the name keeps room.
 */
export type MasterTableMode = "full" | "laptop" | "tablet";

export const masterTableModeFor = (contentWidth: number): MasterTableMode => {
  if (contentWidth >= 1040) return "full";
  if (contentWidth >= 900) return "laptop";
  return "tablet";
};
