/**
 * Pure layout rules for mobile bottom sheets and modal cards. Import-free so
 * the invariant can be unit-tested with `node --test`.
 *
 * Invariant: a sheet's top edge never rises above `insets.top + TOP_SAFE_GAP`.
 * Content that does not fit scrolls inside the sheet instead.
 */

/** Breathing room kept between the status bar / notch and the top of a sheet. */
export const TOP_SAFE_GAP = 8;

/**
 * How much of the sheet's container the keyboard actually covers.
 *
 * Measured, not assumed: Android may or may not shrink a modal's window for
 * the keyboard (it depends on the OS version, edge-to-edge and the vendor),
 * and iOS never does. Comparing the container's real bottom edge with the
 * keyboard's top edge gives 0 when the system already made room and the full
 * overlap when it did not, so the keyboard is never compensated twice.
 */
export const keyboardOverlap = ({
  containerBottom,
  keyboardTop,
}: {
  containerBottom: number;
  keyboardTop: number | null;
}): number => (keyboardTop === null ? 0 : Math.max(0, Math.round(containerBottom - keyboardTop)));

/**
 * Tallest a sheet may be: the height left once the keyboard overlap and the
 * reserved edges are taken out, optionally capped to a share of the visible
 * height so a short sheet still shows some backdrop above it.
 *
 * `reservedTop` must include the safe-area inset (see `reservedEdges`), which
 * is what keeps the sheet's top edge below the status bar / notch.
 */
export const sheetMaxHeight = ({
  containerHeight,
  overlap,
  reservedTop,
  reservedBottom = 0,
  ratio = 1,
}: {
  containerHeight: number;
  overlap: number;
  reservedTop: number;
  reservedBottom?: number;
  ratio?: number;
}): number => {
  const visible = Math.max(0, containerHeight - overlap);
  const free = visible - reservedTop - reservedBottom;
  return Math.max(0, Math.floor(Math.min(free, visible * ratio)));
};

/**
 * Space a sheet's container keeps clear above and below the surface.
 * Top: the safe area plus TOP_SAFE_GAP, never less than `edgePadding`.
 * Bottom: a bottom sheet runs to the edge and pads its own last row, while a
 * centred card keeps the same gap below it, clear of the navigation bar.
 */
export const reservedEdges = ({
  variant,
  insetTop,
  bottomInset,
  edgePadding = 0,
}: {
  variant: "sheet" | "centered";
  insetTop: number;
  bottomInset: number;
  edgePadding?: number;
}): { top: number; bottom: number } => ({
  top: Math.max(insetTop + TOP_SAFE_GAP, edgePadding),
  bottom: variant === "centered" ? Math.max(bottomInset + TOP_SAFE_GAP, edgePadding) : 0,
});

/**
 * Space to keep under the sheet's last row: the home indicator / navigation
 * bar while the keyboard is closed, nothing while it is open (the keys cover
 * that area and extra padding would leave a dead gap above them).
 */
export const sheetBottomInset = ({
  keyboardVisible,
  insetBottom,
}: {
  keyboardVisible: boolean;
  insetBottom: number;
}): number => (keyboardVisible ? 0 : insetBottom);

/** A preferred minimum height that can never push the sheet past its maximum. */
export const clampMinHeight = (preferred: number, maxHeight: number): number =>
  Math.max(0, Math.min(preferred, maxHeight));
