import { DEFAULT_FLUID_MIN } from "./tableTokens.ts";

/**
 * How columns are sized and which ones fit. Header, body and skeleton cells all
 * take their size from `cellSizing`, so a column's edges are the same in every
 * row and content can never push them. Import-free so it runs under node --test.
 */

export type Tier = "sm" | "md" | "lg";

/** Window widths where each tier starts; mirrors BREAKPOINTS in src/theme/breakpoints.ts. */
export const TIER_MIN_WIDTH: Record<Tier, number> = {
  sm: 480,
  md: 768,
  lg: 1024,
};

/** Which columns go first when the table is too narrow: the least important tier first. */
const DROP_ORDER: Tier[] = ["lg", "md", "sm"];

export type ColumnSizing = {
  key: string;
  width?: number;
  flex?: number;
  minWidth?: number;
  hideBelow?: Tier;
};

export type CellSizing = {
  width?: number;
  flexGrow: number;
  flexShrink: 0;
  flexBasis?: number;
  minWidth?: number;
};

export const minWidthOf = (column: ColumnSizing): number => column.width ?? column.minWidth ?? DEFAULT_FLUID_MIN;

export const minTableWidth = (columns: ColumnSizing[]): number =>
  columns.reduce((total, column) => total + minWidthOf(column), 0);

/**
 * Fixed columns are exactly `width`. Fluid columns start at their minimum and
 * share the remaining width by `flex`. Nothing shrinks, so a long value
 * truncates inside its cell instead of moving the cell's edge.
 */
export const cellSizing = (column: ColumnSizing): CellSizing =>
  column.width !== undefined
    ? { width: column.width, flexGrow: 0, flexShrink: 0 }
    : {
        flexGrow: column.flex ?? 1,
        flexShrink: 0,
        flexBasis: minWidthOf(column),
        minWidth: minWidthOf(column),
      };

export type ColumnPlan<C extends ColumnSizing> = {
  visible: C[];
  hiddenKeys: ReadonlySet<string>;
  /** True when even the essential columns are wider than the table: header and body scroll sideways together. */
  scrolls: boolean;
  /** Width of the scrolling content when `scrolls`; otherwise the table fills its container. */
  contentWidth?: number;
};

/**
 * Columns with `hideBelow` leave below that window tier. If the rest still do
 * not fit the measured table width, lower-priority tiers leave too ("lg" first).
 * Whatever remains keeps its minimum widths and scrolls sideways.
 * A `tableWidth` of 0 means "not measured yet": only the window rule applies.
 */
export const planColumns = <C extends ColumnSizing>(
  columns: C[],
  windowWidth: number,
  tableWidth: number
): ColumnPlan<C> => {
  let visible = columns.filter((column) => !column.hideBelow || windowWidth >= TIER_MIN_WIDTH[column.hideBelow]);

  if (tableWidth > 0) {
    for (const tier of DROP_ORDER) {
      if (minTableWidth(visible) <= tableWidth) break;
      visible = visible.filter((column) => column.hideBelow !== tier);
    }
  }

  const needed = minTableWidth(visible);
  const scrolls = tableWidth > 0 && needed > tableWidth;
  const hiddenKeys = new Set(columns.filter((column) => !visible.includes(column)).map((column) => column.key));

  return {
    visible,
    hiddenKeys,
    scrolls,
    contentWidth: scrolls ? needed : undefined,
  };
};
