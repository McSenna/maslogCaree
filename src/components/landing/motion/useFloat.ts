import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useReducedMotion } from "@/design/motion";
import { FLOAT_DISTANCE, FLOAT_DURATION, floatEasing } from "./landingMotion";

type FloatOptions = {
  distance?: number;
  duration?: number;
  delay?: number;
};

export const useFloat = ({
  distance = FLOAT_DISTANCE,
  duration = FLOAT_DURATION,
  delay = 0,
}: FloatOptions = {}) => {
  const reducedMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration,
          delay,
          easing: floatEasing,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration,
          easing: floatEasing,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [reducedMotion, progress, duration, delay]);

  if (reducedMotion) return 0;

  return progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -distance],
  });
};
