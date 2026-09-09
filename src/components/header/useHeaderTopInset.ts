import { Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Design spacing added *after* the system inset.
 *
 * Zero on purpose: the system inset already clears the clock, camera cutout and
 * battery icons, and the header row carries its own vertical padding below.
 * Anything added here lands between the two and reads as a gap, which is
 * exactly the space this header kept accumulating.
 */
export const HEADER_TOP_GAP = 0;

/**
 * The one top inset the MaslogCare header applies.
 *
 * Applied here and nowhere else: the layouts that render the header must not
 * add `SafeAreaView edges={["top"]}`, `paddingTop` or `StatusBar.currentHeight`
 * of their own, or the spacing stacks.
 *
 * On Android the platform's own `StatusBar.currentHeight` is authoritative —
 * it already grows to clear a punch-hole or notch — so it caps the value from
 * the safe-area provider. That matters because Expo Go and some OEM skins
 * report a top inset larger than the bar actually occupies, which is what
 * leaves a tall empty band above the header. The clamp can only ever reduce an
 * over-report; it never insets less than the OS says the status bar needs.
 */
export function useHeaderTopInset(): number {
  const insets = useSafeAreaInsets();

  if (Platform.OS !== "android") return insets.top;

  const statusBarHeight = StatusBar.currentHeight ?? 0;
  return statusBarHeight > 0 ? Math.min(insets.top, statusBarHeight) : insets.top;
}
