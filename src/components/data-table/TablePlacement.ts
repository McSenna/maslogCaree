import { createContext, useContext } from "react";

import type { Align } from "./types";

/**
 * Where a cell's content is drawn. The same column render serves the table row
 * and the phone card; buttons read this to grow to full-width 44px targets on cards.
 */
export type TablePlacement = "table" | "card";

export const TablePlacementContext = createContext<TablePlacement>("table");

export const useTablePlacement = (): TablePlacement => useContext(TablePlacementContext);

type SelfAlign = "flex-start" | "center" | "flex-end";

/**
 * A table cell's horizontal alignment, for chips that otherwise hug the left
 * (`alignSelf: flex-start`) so they do not stretch in a column layout.
 */
export const CellAlignContext = createContext<SelfAlign>("flex-start");

export const useCellSelfAlign = (): SelfAlign => useContext(CellAlignContext);

/** Text renders inherit the same alignment as their header, including multiline values. */
export const useCellTextAlign = (): Align => {
  const align = useCellSelfAlign();
  return align === "flex-start" ? "left" : align === "flex-end" ? "right" : "center";
};
