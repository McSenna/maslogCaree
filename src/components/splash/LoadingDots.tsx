import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { SPLASH_COLORS, SPLASH_TIMING } from "./splashTheme";

type LoadingDotsProps = {
  size?: number;
  color?: string;
};

const DOT_COUNT = 3;

const LoadingDots = ({ size = 10, color = SPLASH_COLORS.dot }: LoadingDotsProps) => {
  const progress = useMemo(
    () => Array.from({ length: DOT_COUNT }, () => new Animated.Value(0)),
    []
  );

  const loopsRef = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    const { dotCycle } = SPLASH_TIMING;

    loopsRef.current = progress.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay((dotCycle / DOT_COUNT) * index),
          Animated.timing(value, {
            toValue: 1,
            duration: dotCycle / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: dotCycle / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay((dotCycle / DOT_COUNT) * (DOT_COUNT - 1 - index)),
        ])
      )
    );

    loopsRef.current.forEach((loop) => loop.start());

    return () => {
      loopsRef.current.forEach((loop) => loop.stop());
    };
  }, [progress]);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      className="flex-row items-center justify-center"
      style={{ columnGap: size * 0.9 }}
    >
      {progress.map((value, index) => (
        <Animated.View
          key={index}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: value.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
            transform: [
              { scale: value.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] }) },
            ],
          }}
        />
      ))}
    </View>
  );
};

export default LoadingDots;
