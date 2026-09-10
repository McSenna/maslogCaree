/** How many accounts one page of the list holds. */
export const PAGE_SIZE = 8;

/**
 * Content-area widths, measured rather than taken from the window: the admin
 * sidebar owns a fixed slice of the viewport, so the window width alone would
 * put the table into a layout the page does not actually have room for.
 */
export const USERS_LAYOUT = {
  /** Four metric cards across instead of a 2x2 grid. */
  fourMetrics: 1000,
  /** The table replaces the card list. */
  table: 820,
} as const;

/** Narrowest phones (320–360px) — trims the avatar and type, keeps the grid. */
export const DENSE_WINDOW_WIDTH = 380;
