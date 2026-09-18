import { Platform, StatusBar as RNStatusBar } from "react-native";
import { StatusBar } from "expo-status-bar";

type AppStatusBarProps = {
  /** Icon/text colour: "dark" for light surfaces, "light" for dark ones. */
  style: "light" | "dark";
  /**
   * The surface the bar sits on. Used to paint the Android status bar strip so
   * it matches the screen underneath it.
   */
  backgroundColor: string;
};

/**
 * The single owner of status bar appearance.
 *
 * Two APIs are needed because neither covers both halves on Expo SDK 57:
 *
 * - `expo-status-bar` sets the icon colour, and is what the `expo-status-bar`
 *   config plugin in app.json aligns with. Its `backgroundColor` and
 *   `translucent` props were removed in SDK 54+, so it cannot colour the bar.
 * - React Native's `StatusBar` still sets the Android bar colour. That matters
 *   because Expo SDK 57 no longer applies edge-to-edge itself — below Android
 *   15 the OS does not enforce it either, so the status bar remains a separate
 *   opaque strip. Expo forces `android:statusBarColor` to transparent, which on
 *   such a window paints black. Painting it with the screen colour instead
 *   makes it continuous with the header.
 *
 * On Android 15+ the window is edge-to-edge and the platform ignores the bar
 * colour; the header's own background shows through its safe-area padding, so
 * the result is the same either way.
 */
const AppStatusBar = ({ style, backgroundColor }: AppStatusBarProps) => (
  <>
    <StatusBar style={style} />
    {Platform.OS === "android" ? (
      <RNStatusBar backgroundColor={backgroundColor} />
    ) : null}
  </>
);

export default AppStatusBar;
