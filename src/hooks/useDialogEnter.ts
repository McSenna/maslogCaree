import { useEffect } from "react";
import { Animated } from "react-native";
import { EASING, TIMING, USE_NATIVE_DRIVER } from "@/theme/motion";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

export const useDialogEnter = (visible: boolean) => {
  const enter = useAnimatedValue(0);

  useEffect(() => {
    if (!visible) {
      enter.setValue(0);
      return;
    }
    Animated.timing(enter, {
      toValue: 1,
      duration: TIMING.enter,
      easing: EASING.out,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [visible, enter]);

  return enter;
};
