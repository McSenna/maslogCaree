/**
 * Fixed column widths shared by the header row and every data row. The table
 * is laid out in the content area beside the app's sidebar, so it measures
 * that width: Posted and Expires drop out (they stay in the expanded details)
 * before the title column gets too narrow to read.
 */
export type TableMode = "full" | "compact";

export const COLUMN = {
  audience: "w-[110px]",
  status: "w-[110px]",
  posted: "w-[150px]",
  expires: "w-[120px]",
  actions: "w-[140px]",
} as const;

// Fixed columns + 24px gaps + 32px padding, plus at least 240px for titles.
export const FULL_TABLE_MIN_WIDTH = 1020;
// Without Posted and Expires.
export const TABLE_MIN_WIDTH = 700;

export const tableModeFor = (width: number): TableMode =>
  width >= FULL_TABLE_MIN_WIDTH ? "full" : "compact";
