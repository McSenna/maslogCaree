/**
 * Safe-area layout constants and calculation helpers for the MaslogCare
 * docked bottom navigation.
 *
 * The bar is anchored to the bottom edge of the screen and grows by the
 * device's bottom safe-area inset, so it always sits ABOVE the Android
 * 3-button bar / gesture pill and the iOS home indicator.
 */

/**
 * Height of the row that holds the icon of every tab — kept at the 44px
 * minimum touch target, which is as compact as the bar can go and stay tappable.
 */
export const BOTTOM_NAV_ROW_HEIGHT = 44;

/**
 * Breathing room between the bar's top border and the tab row.
 */
export const BOTTOM_NAV_TOP_PADDING = 6;

/**
 * Bottom padding used when the device reports no safe-area inset
 * (Android hardware keys, most emulators, web).
 */
export const BOTTOM_NAV_MIN_BOTTOM_PADDING = 8;

/**
 * Nominal bar height excluding the safe-area inset. Kept as a named export so
 * screens can reason about the chrome without recomputing it.
 */
export const BOTTOM_NAV_HEIGHT =
  BOTTOM_NAV_TOP_PADDING + BOTTOM_NAV_ROW_HEIGHT + BOTTOM_NAV_MIN_BOTTOM_PADDING;

/**
 * Breathing room between the bottommost screen content (last card, button, or
 * form field) and the top edge of the bottom navigation bar.
 */
export const BOTTOM_NAV_CONTENT_CLEARANCE = 10;

/**
 * Bottom padding the bar itself applies so its tappable row clears the device's
 * native navigation area.
 *
 * @param bottomInset - Device bottom safe-area inset (useSafeAreaInsets().bottom)
 */
export function getBottomNavBottomPadding(bottomInset: number): number {
  return Math.max(bottomInset, BOTTOM_NAV_MIN_BOTTOM_PADDING);
}

/**
 * Total on-screen height of the bottom navigation bar, safe area included.
 *
 * @param bottomInset - Device bottom safe-area inset (useSafeAreaInsets().bottom)
 */
export function getBottomNavHeight(bottomInset: number): number {
  return (
    BOTTOM_NAV_TOP_PADDING +
    BOTTOM_NAV_ROW_HEIGHT +
    getBottomNavBottomPadding(bottomInset)
  );
}

/**
 * Bottom padding required on screen content containers (ScrollView,
 * FlatList, forms) so content can scroll completely clear of the bar.
 *
 * @param bottomInset - Device bottom safe-area inset (useSafeAreaInsets().bottom)
 */
export function getBottomContentPadding(bottomInset: number): number {
  return getBottomNavHeight(bottomInset) + BOTTOM_NAV_CONTENT_CLEARANCE;
}
