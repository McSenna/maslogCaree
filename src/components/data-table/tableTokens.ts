/**
 * Geometry and type for every data table. Import-free so the column layout
 * tests can read it. Spacing values are steps of the 4px scale.
 */

/** Left and right padding of every header and body cell. The one source of column insets. */
export const CELL_PX = 16;

/** Padding between the table card's edge and the table inside it. */
export const TABLE_INSET = 12;

export const HEADER_HEIGHT = 40;

/** Regular rows fit a name over an ID; compact rows are for dashboard panels. */
export const ROW_MIN_HEIGHT = { regular: 64, compact: 48 } as const;

export type TableDensity = keyof typeof ROW_MIN_HEIGHT;

/** A fluid column with no `minWidth` never gets narrower than this. */
export const DEFAULT_FLUID_MIN = 120;

/** Smallest tap target on phones. */
export const TAP_TARGET = 44;

/** Controls inside a table row. */
export const CONTROL_HEIGHT = 36;

export const SKELETON_ROWS = 5;

/** Row hover feedback on the web, in ms. */
export const ROW_HOVER_MS = 120;

export const TABLE_TEXT = {
  header: { fontSize: 13, lineHeight: 18, fontWeight: "600" },
  cell: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
  primary: { fontSize: 14, lineHeight: 20, fontWeight: "600" },
  secondary: { fontSize: 12, lineHeight: 16, fontWeight: "400" },
  badge: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
  badgeLarge: { fontSize: 13, lineHeight: 18, fontWeight: "600" },
  button: { fontSize: 13, lineHeight: 18, fontWeight: "600" },
  emptyTitle: { fontSize: 15, lineHeight: 22, fontWeight: "600" },
} as const;
