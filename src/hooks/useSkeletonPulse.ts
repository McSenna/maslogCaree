import { useEffect } from "react";
import { Animated, Easing } from "react-native";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";

const HALF_CYCLE_MS = 700;
const pulseEasing = Easing.inOut(Easing.sin);

/** Shared loading pulse for skeleton blocks; holds still under reduced motion. */
export const useSkeletonPulse = (low: number, high: number): Animated.Value => {
  const reducedMotion = useReducedMotion();
  const value = useAnimatedValue(high);

  useEffect(() => {
    if (reducedMotion) {
      value.setValue(high);
      return;
    }
    const step = (toValue: number) =>
      Animated.timing(value, { toValue, duration: HALF_CYCLE_MS, easing: pulseEasing, useNativeDriver: USE_NATIVE_DRIVER });
    const loop = Animated.loop(Animated.sequence([step(low), step(high)]));
    loop.start();
    return () => loop.stop();
  }, [value, low, high, reducedMotion]);

  return value;
};
