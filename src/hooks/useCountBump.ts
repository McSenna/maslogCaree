import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";

const BUMP_SCALE = 1.18;

/** Scale settle for a count badge when the count rises; decreases stay still. */
export const useCountBump = (count: number) => {
  const reducedMotion = useReducedMotion();
  const scale = useAnimatedValue(1);
  const previous = useRef(count);

  useEffect(() => {
    const rose = count > previous.current;
    previous.current = count;
    if (!rose || reducedMotion) return;

    scale.setValue(BUMP_SCALE);
    const animation = Animated.timing(scale, {
      toValue: 1,
      duration: TIMING.enter + 60,
      easing: EASING.out,
      useNativeDriver: USE_NATIVE_DRIVER,
    });
    animation.start();
    return () => animation.stop();
  }, [count, reducedMotion, scale]);

  return { transform: [{ scale }] };
};
