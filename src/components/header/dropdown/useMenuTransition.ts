import { useEffect, useMemo, useState } from "react";
import { Animated, type ViewStyle } from "react-native";

import { CLOSE_MS, LIFT, OPEN_MS, SHRINK } from "./dropdownTypes";
import { EASING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

export const useMenuTransition = (visible: boolean) => {
  const reducedMotion = useReducedMotion();
  const progress = useAnimatedValue(0);
  const [mounted, setMounted] = useState(visible);

  // Mount synchronously when opening; unmount only after the close animation finishes.
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? OPEN_MS : CLOSE_MS,
      easing: EASING.out,
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
      transformOrigin: "top right",
      transform: [
        { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 0 : LIFT, 0] }) },
        { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 1 : SHRINK, 1] }) },
      ],
    }),
    [progress, reducedMotion]
  );

  return { mounted, style };
};
