import { useEffect, useState } from "react";
import { Animated } from "react-native";
import { USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";
import { LIFT_SPRING } from "./landingMotion";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

type LiftOptions = {
  lift?: number;
  pressScale?: number;
  hoverScale?: number;
};

export const useInteractiveLift = ({
  lift = 2,
  pressScale = 0.98,
  hoverScale = 1,
}: LiftOptions = {}) => {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const translateY = useAnimatedValue(0);
  const scale = useAnimatedValue(1);

  useEffect(() => {
    const targetY = reducedMotion || pressed ? 0 : hovered ? -lift : 0;
    const targetScale = reducedMotion ? 1 : pressed ? pressScale : hovered ? hoverScale : 1;

    const animation = Animated.parallel([
      Animated.spring(translateY, { toValue: targetY, useNativeDriver: USE_NATIVE_DRIVER, ...LIFT_SPRING }),
      Animated.spring(scale, { toValue: targetScale, useNativeDriver: USE_NATIVE_DRIVER, ...LIFT_SPRING }),
    ]);

    animation.start();

    return () => animation.stop();
  }, [hovered, pressed, reducedMotion, lift, pressScale, hoverScale, translateY, scale]);

  return {
    hovered,
    pressed,
    active: hovered || pressed,
    handlers: {
      onHoverIn: () => setHovered(true),
      onHoverOut: () => setHovered(false),
      onPressIn: () => setPressed(true),
      onPressOut: () => setPressed(false),
    },
    liftStyle: { transform: [{ translateY }, { scale }] },
  };
};
