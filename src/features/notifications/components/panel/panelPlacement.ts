import { NOTIFICATION_METRICS } from "../../notification.theme";
import type { BellPosition } from "../../notification.types";

const EDGE = 16;
const GAP = 10;
const MIN_HEIGHT = 260;

export type PanelPlacement = {
  width: number;
  top: number;
  right: number;
  maxHeight: number;
};

const resolveWidth = (screenWidth: number): number => {
  const available = screenWidth - EDGE * 2;
  if (available <= NOTIFICATION_METRICS.panelMinWidth) return Math.max(available, 0);
  return Math.min(available, NOTIFICATION_METRICS.panelMaxWidth);
};

/**
 * Anchors the panel under the header bell and clamps it inside the viewport so
 * narrow browser windows and large monitors both render it fully on screen.
 * `bottomInset` keeps the last row clear of the Android gesture bar and the
 * iPhone home indicator, which the window height counts as usable space.
 */
export const resolvePanelPlacement = (
  screenWidth: number,
  screenHeight: number,
  bell: BellPosition | null,
  bottomInset = 0
): PanelPlacement => {
  const width = resolveWidth(screenWidth);

  const top = bell ? Math.max(EDGE, bell.y + bell.height + GAP) : EDGE;
  const anchoredRight = bell ? screenWidth - (bell.x + bell.width) : EDGE;

  const right = Math.min(
    Math.max(anchoredRight, EDGE),
    Math.max(screenWidth - width - EDGE, EDGE)
  );

  const maxHeight = Math.max(
    MIN_HEIGHT,
    Math.min(NOTIFICATION_METRICS.panelMaxHeight, screenHeight - top - EDGE - bottomInset)
  );

  return { width, top, right, maxHeight };
};
