import { useEffect, useRef } from "react";
import { AccessibilityInfo, Animated, Easing } from "react-native";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

/**
 * Chart draw-in: 0 → 1 once, when the chart first appears. Later `resetKey` changes (a filter or range
 * switch) jump straight to the new data, because replaying a 600ms grow-from-zero on every toggle makes
 * repeated filtering feel slow.
 */
export const useMountProgress = (durationMs = 600, resetKey: unknown = "static"): Animated.Value => {
  const progress = useAnimatedValue(0);
  const playedRef = useRef(false);

  useEffect(() => {
    if (playedRef.current) {
      progress.stopAnimation();
      progress.setValue(1);
      return;
    }
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
      // Marked here rather than above so a StrictMode double effect doesn't skip the first draw-in.
      playedRef.current = true;
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
