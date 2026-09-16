import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  computeDesktopLandingLayout,
  type DesktopLandingLayout,
} from "@/screens/landing/desktopLandingLayout";

export const useDesktopLandingLayout = (): DesktopLandingLayout => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(
    () =>
      computeDesktopLandingLayout({
        width,
        height,
        insets: { top: insets.top, bottom: insets.bottom },
      }),
    [width, height, insets.top, insets.bottom]
  );
};
