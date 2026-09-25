import { useEffect, type ReactNode } from "react";
import { Animated, type StyleProp, type ViewStyle } from "react-native";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  offset?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
};

const FadeIn = ({ children, delay = 0, offset = 6, duration = TIMING.enter, style }: FadeInProps) => {
  const reducedMotion = useReducedMotion();
  const progress = useAnimatedValue(0);

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      delay,
      duration: reducedMotion ? TIMING.exit : duration,
      easing: EASING.out,
      useNativeDriver: USE_NATIVE_DRIVER,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, delay, duration, reducedMotion]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 0 : offset, 0] });

  return <Animated.View style={[{ opacity: progress, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
};

export default FadeIn;
