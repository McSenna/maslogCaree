import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getBottomContentPadding, getBottomNavHeight } from "@/constants/layout";

/**
 * Safe-area aware measurements of the bottom bar.
 *
 * Layouts read the content padding from here instead of hard-coding it, so the
 * bar's height and the clearance screens reserve for it can never drift apart.
 */
export function useBottomNavMetrics() {
  const insets = useSafeAreaInsets();

  return {
    /** Total on-screen height of the bar, safe area included. */
    height: getBottomNavHeight(insets.bottom),
    /** paddingBottom screens need so content scrolls clear of the bar. */
    contentPadding: getBottomContentPadding(insets.bottom),
    bottomInset: insets.bottom,
  };
}
