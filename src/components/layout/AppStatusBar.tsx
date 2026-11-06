import { StatusBar } from "expo-status-bar";

type AppStatusBarProps = {
  /** Icon/text colour: "dark" for light surfaces, "light" for dark ones. */
  style: "light" | "dark";
};

/**
 * The single owner of status bar appearance.
 *
 * Only the icon colour is set here. React Native 0.88 is edge-to-edge only and
 * removed `StatusBar.backgroundColor`, so the bar has no colour of its own:
 * every caller paints its surface under the top safe-area inset instead.
 */
const AppStatusBar = ({ style }: AppStatusBarProps) => <StatusBar style={style} />;

export default AppStatusBar;
