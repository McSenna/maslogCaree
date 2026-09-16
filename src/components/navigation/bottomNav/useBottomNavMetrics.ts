import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getBottomContentPadding, getBottomNavHeight } from "@/constants/layout";

export const useBottomNavMetrics = () => {
  const insets = useSafeAreaInsets();

  return {
    height: getBottomNavHeight(insets.bottom),
    contentPadding: getBottomContentPadding(insets.bottom),
    bottomInset: insets.bottom,
  };
};
