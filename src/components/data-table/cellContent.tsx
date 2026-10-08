import type { ReactNode } from "react";

import { TableText } from "./TableText";
import type { CellContext, Column } from "./types";

/** A column's content for one row: its render, else its plain value as cell text. */
export const cellContent = <T,>(column: Column<T>, row: T, index: number, context: CellContext): ReactNode => {
  if (column.render) return column.render(row, index, context);
  return column.accessor ? <TableText value={String(column.accessor(row))} align={column.align} /> : null;
};
