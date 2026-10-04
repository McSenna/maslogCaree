/**
 * Where a row's action menu opens: right-aligned under its button, flipped
 * above it when the space below runs out, and never past a screen edge.
 * Free of React so `node --test` can load it.
 */

export type Rect = { x: number; y: number; width: number; height: number };
type Size = { width: number; height: number };
type Insets = { top: number; bottom: number };

export const MENU_GAP = 4;
const EDGE = 8;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

export const placeMenu = (button: Rect, menu: Size, viewport: Size, insets: Insets) => {
  const lowest = viewport.height - insets.bottom - EDGE - menu.height;
  const highest = insets.top + EDGE;
  const below = button.y + button.height + MENU_GAP;
  const above = button.y - MENU_GAP - menu.height;
  const flipped = below > lowest && above >= highest;

  return {
    top: flipped ? above : clamp(below, highest, lowest),
    left: clamp(button.x + button.width - menu.width, EDGE, viewport.width - EDGE - menu.width),
    flipped,
  };
};
