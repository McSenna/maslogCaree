import type { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";

import type { Tier } from "./columnLayout";
import type { TableDensity } from "./tableTokens";

export type Align = "left" | "center" | "right";

export type FeatherName = keyof typeof Feather.glyphMap;

/** Where a column's value goes on a phone card when no `renderMobileCard` is given. */
export type CardRole = "title" | "field" | "badge" | "actions" | "hidden";

/** Passed to every render, so the primary cell can fold in values whose column is hidden at this width. */
export type CellContext = { hiddenKeys: ReadonlySet<string> };

export type Column<T> = {
  key: string;
  header: string;
  /** Fixed width in px, padding included. */
  width?: number;
  /** Share of the width left after fixed columns. */
  flex?: number;
  minWidth?: number;
  /** Applies to the header label and the cell content alike. */
  align?: Align;
  render?: (row: T, index: number, context: CellContext) => ReactNode;
  /** Plain value: the default cell, and what phone cards and spoken row labels use. */
  accessor?: (row: T) => string | number;
  /** Leaves the table below this window tier, then as needed when the table is narrow ("lg" first). */
  hideBelow?: Tier;
  /** Replaces the header label, e.g. a select-all checkbox. `header` stays its accessible name. */
  renderHeader?: () => ReactNode;
  cardRole?: CardRole;
};

export type TablePagination = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** What the rows are, for the range line: "records", "users". */
  noun?: string;
};

export type EmptyAction = {
  label: string;
  icon?: FeatherName;
  onPress: () => void;
  /** Primary for "add the first one" (default), outlined for "clear the search". */
  variant?: "primary" | "outlined";
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  /** Accessible name of the table, e.g. "Resident records". */
  caption: string;
  loading?: boolean;
  /** A refetch of rows already shown: they dim instead of turning into skeletons. */
  refreshing?: boolean;
  error?: string | null;
  errorTitle?: string;
  onRetry?: () => void;
  emptyIcon?: FeatherName;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: EmptyAction;
  pagination?: TablePagination;
  /** Footer content when the table is not paged, e.g. a count line. */
  footer?: ReactNode;
  /** Search and filters inside the card, above the header. */
  toolbar?: ReactNode;
  onRowPress?: (row: T) => void;
  /**
   * "button": the row is one control, announced by `rowLabel`.
   * "pointer": a click anywhere opens the row, while keyboard and screen reader
   * users reach the same action through a control in the row (rows that also
   * hold checkboxes or buttons).
   */
  rowPressMode?: "button" | "pointer";
  rowLabel?: (row: T) => string;
  rowHint?: string;
  isRowSelected?: (row: T) => boolean;
  /** Content shown under a row's cells, e.g. an expanded message. */
  renderExpanded?: (row: T) => ReactNode;
  renderMobileCard?: (row: T) => ReactNode;
  /** "auto" shows cards below 768px. Panels that know their own width pass "table" or "cards". */
  layout?: "auto" | "table" | "cards";
  /** "card" draws the bordered table card; "plain" sits inside a panel that already has one. */
  surface?: "card" | "plain";
  density?: TableDensity;
  /** Outlines every cell, to check that each column edge is one straight line. */
  debug?: boolean;
};
