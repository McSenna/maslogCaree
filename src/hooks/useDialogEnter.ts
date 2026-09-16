import { useEffect, useRef } from "react";
import { Animated, Platform } from "react-native";

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
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [visible, enter]);

  return enter;
};
