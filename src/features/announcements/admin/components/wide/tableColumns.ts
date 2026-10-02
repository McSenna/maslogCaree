/**
 * Fixed column widths shared by the heading band and every data row. The
 * table sits beside the app's sidebar, so it measures that width: Posted and
 * Expires drop out (they stay in the expanded details) before the title
 * column gets too narrow to read.
 */
export type TableMode = "full" | "compact";

export const COLUMN = {
  audience: "w-[100px]",
  status: "w-[120px]",
  posted: "w-[140px]",
  expires: "w-[110px]",
  actions: "w-[140px]",
} as const;

// Fixed columns + 12px gaps + card and row padding, plus at least 240px for titles.
export const FULL_TABLE_MIN_WIDTH = 1000;
// Without Posted and Expires.
export const TABLE_MIN_WIDTH = 700;

export const tableModeFor = (width: number): TableMode => (width >= FULL_TABLE_MIN_WIDTH ? "full" : "compact");

/** Tabs, search and audience share one toolbar row only when all fit. */
export const TOOLBAR_ONE_ROW_WIDTH = 1000;
