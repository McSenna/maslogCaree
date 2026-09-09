import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { SPLASH_COLORS, SPLASH_TIMING } from "./splashTheme";

type LoadingDotsProps = {
  /** Diameter of each dot. */
  size?: number;
  color?: string;
};

const DOT_COUNT = 3;

/**
 * Three dots that pulse in sequence.
 *
 * Driven by one `Animated.Value` per dot on the native driver, so the loop runs
 * off the JS thread and keeps ticking while startup work is still resolving —
 * an indicator that freezes exactly when the app is busiest would be worse than
 * none at all.
 *
 * Opacity and scale only: no travel, no spin.
 */
const LoadingDots = ({ size = 10, color = SPLASH_COLORS.dot }: LoadingDotsProps) => {
  // One value per dot, created once — a fresh array each render would restart
  // the loop on every parent update.
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
          // Stagger the three by a third of a cycle each.
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
