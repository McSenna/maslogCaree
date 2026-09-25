import { useEffect } from "react";
import { AccessibilityInfo, Animated, Easing } from "react-native";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

export const useMountProgress = (durationMs = 600, resetKey: unknown = "static"): Animated.Value => {
  const progress = useAnimatedValue(0);

  useEffect(() => {
    let cancelled = false;
    progress.setValue(0);

    const run = async () => {
      let reduceMotion = false;
      try {
        reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
      } catch {
        reduceMotion = false;
      }
      if (cancelled) return;
      if (reduceMotion) {
        progress.setValue(1);
        return;
      }
      Animated.timing(progress, {
        toValue: 1,
        duration: durationMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, durationMs]);

  return progress;
};
