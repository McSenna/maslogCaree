import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { USE_NATIVE_DRIVER } from "@/design/motion";

export const useDialogEnter = (visible: boolean) => {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      enter.setValue(0);
      return;
    }
    Animated.timing(enter, {
      toValue: 1,
      duration: 180,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [visible, enter]);

  return enter;
};
