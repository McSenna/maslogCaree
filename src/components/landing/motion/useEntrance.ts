import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useReducedMotion } from "@/design/motion";
import { ENTER_DISTANCE, ENTER_DURATION, enterEasing } from "./landingMotion";

type EntranceOptions = {
  delay?: number;
  distance?: number;
  duration?: number;
};

export const useEntrance = ({
  delay = 0,
  distance = ENTER_DISTANCE,
  duration = ENTER_DURATION,
}: EntranceOptions = {}) => {
  const reducedMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(1);
      return;
    }

    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: enterEasing,
      useNativeDriver: true,
    });

    animation.start();

    return () => animation.stop();
  }, [reducedMotion, progress, delay, duration]);

  if (reducedMotion) {
    return { opacity: 1, transform: [] as never[] };
  }

  return {
    opacity: progress,
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-distance, 0],
        }),
      },
    ],
  };
};
