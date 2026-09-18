import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, type ViewStyle } from "react-native";

import { CLOSE_MS, LIFT, OPEN_MS, SHRINK } from "./dropdownTypes";
import { USE_NATIVE_DRIVER } from "@/design/motion";

export const useMenuTransition = (visible: boolean) => {
  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(mounted);
  mountedRef.current = mounted;

  useEffect(() => {
    if (visible) setMounted(true);
    else if (!mountedRef.current) return;

    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? OPEN_MS : CLOSE_MS,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER,
    });

    animation.start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });

    return () => animation.stop();
  }, [visible, progress]);

  const style = useMemo<Animated.WithAnimatedObject<ViewStyle>>(
    () => ({
      opacity: progress,
      transform: [
        { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [LIFT, 0] }) },
        { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [SHRINK, 1] }) },
      ],
    }),
    [progress]
  );

  return { mounted, style };
};
