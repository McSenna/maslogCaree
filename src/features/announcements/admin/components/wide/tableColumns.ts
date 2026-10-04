/**
 * Column sizes shared by the heading band and every data row. Title takes three
 * shares and each data column one, with a floor, so on a wide screen the
 * columns spread out instead of leaving a gap after the title; Actions keeps
 * the width of its three buttons. The table sits beside the app's sidebar, so
 * it measures that width: Posted and Expires drop out (they stay in the
 * expanded details) before the title column gets too narrow to read.
 */
export type TableMode = "full" | "compact";

export const COLUMN = {
  title: "min-w-0 flex-[3]",
  audience: "min-w-[100px] flex-1",
  status: "min-w-[120px] flex-1",
  posted: "min-w-[140px] flex-1",
  expires: "min-w-[110px] flex-1",
  actions: "w-[140px]",
} as const;

// Column floors + 12px gaps + card and row padding, plus at least 240px for titles.
export const FULL_TABLE_MIN_WIDTH = 1000;
// Without Posted and Expires.
export const TABLE_MIN_WIDTH = 700;

export const tableModeFor = (width: number): TableMode => (width >= FULL_TABLE_MIN_WIDTH ? "full" : "compact");

/** Tabs, search and audience share one toolbar row only when all fit. */
export const TOOLBAR_ONE_ROW_WIDTH = 1000;
