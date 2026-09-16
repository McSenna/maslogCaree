import { Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const HEADER_TOP_GAP = 0;

export const useHeaderTopInset = (): number => {
  const insets = useSafeAreaInsets();

  if (Platform.OS !== "android") return insets.top;

  const statusBarHeight = StatusBar.currentHeight ?? 0;
  return statusBarHeight > 0 ? Math.min(insets.top, statusBarHeight) : insets.top;
};
