/** How many items one page of the list holds. */
export const PAGE_SIZE = 8;

/** Search waits this long after the last keystroke before hitting the server. */
export const SEARCH_DEBOUNCE_MS = 350;

/**
 * Content-area widths, measured rather than taken from the window: the sidebar
 * owns a fixed slice of the viewport, so the window width alone would put the
 * table into a layout the page does not have room for.
 */
export const INVENTORY_LAYOUT = {
  /** Four metric cards across instead of a 2x2 grid. */
  fourMetrics: 1000,
  /** The table replaces the card list. */
  table: 820,
  /** The details panel sits beside the table instead of below it. */
  sidePanel: 1180,
} as const;

/** Width the details column takes when it sits beside the table. */
export const PANEL_WIDTH = 344;

/** Narrowest phones (320–360px) — trims the icon, keeps the grid. */
export const DENSE_WINDOW_WIDTH = 380;
