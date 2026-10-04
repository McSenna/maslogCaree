/** Column widths shared by the masterlist heading band and its rows. */
export const MASTERLIST_COLUMN = {
  resident: "min-w-[170px] flex-[1.4]",
  visit: "w-[120px] shrink-0",
  service: "min-w-[120px] flex-1",
  provider: "min-w-0 flex-1",
  source: "w-[160px] shrink-0",
  linkage: "w-[130px] shrink-0",
  actions: "w-[96px] shrink-0 items-end",
} as const;

/**
 * Follows the measured content width:
 * - full: every column.
 * - compact: provider and source fold under the service.
 */
export type MasterlistTableMode = "full" | "compact";

export const masterlistTableModeFor = (contentWidth: number): MasterlistTableMode =>
  contentWidth >= 1080 ? "full" : "compact";
