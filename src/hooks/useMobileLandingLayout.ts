import { useEffect, useMemo, useState } from "react";
import { Keyboard, Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  computeMobileLandingLayout,
  type MobileLandingLayout,
} from "@/screens/landing/mobileLandingLayout";

const useKeyboardInset = () => {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const show = Keyboard.addListener("keyboardDidShow", (event) =>
      setInset(event.endCoordinates?.height ?? 0),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () => setInset(0));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return inset;
};

export const useMobileLandingLayout = (): MobileLandingLayout => {
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const keyboardInset = useKeyboardInset();

  return useMemo(
    () =>
      computeMobileLandingLayout({
        width,
        height,
        designHeight: height + keyboardInset,
        insets: { top: insets.top, bottom: insets.bottom },
        fontScale,
      }),
    [fontScale, height, insets.bottom, insets.top, keyboardInset, width],
  );
};
