import { useEffect } from "react";
import { Animated, Easing, Platform, View } from "react-native";
import { USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

const CIRCLE_RATIO = 0.8;
const SHADOW_RATIO = 0.025;

const MIN_SHADOW_PX = 2;

export const ECLIPSE_DEFAULT_SIZE = 48;

export type EclipseLoaderProps = {
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

const EclipseLoader = ({
  size = ECLIPSE_DEFAULT_SIZE,
  color = "#2A7DE1",
  accessibilityLabel = "Loading page",
}: EclipseLoaderProps) => {
  const reducedMotion = useReducedMotion();

  const circle = Math.round(size * CIRCLE_RATIO);
  const offset = Math.max(MIN_SHADOW_PX, +(circle * SHADOW_RATIO).toFixed(2));
  const inset = (size - circle) / 2;
  const originY = circle / 2 + offset / 2;

  const geometry = {
    position: "absolute" as const,
    top: inset,
    left: inset,
    width: circle,
    height: circle,
    borderRadius: circle / 2,
    boxShadow: `0 ${offset}px 0 0 ${color}`,
  };

  const spin = useAnimatedValue(0);

  useEffect(() => {
    if (Platform.OS === "web" || reducedMotion) return;

    spin.setValue(0);
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: USE_NATIVE_DRIVER,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [reducedMotion, spin]);

  if (reducedMotion) {
    return (
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel}
        style={{ width: size, height: size }}
      >
        <View style={geometry} />
      </View>
    );
  }

  if (Platform.OS === "web") {
    return (
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel}
        style={{ width: size, height: size, overflow: "hidden" }}
      >
        <View
          {...({ dataSet: { eclipseSpin: "true" } } as object)}
          style={{ ...geometry, transformOrigin: `${circle / 2}px ${originY}px` }}
        />
      </View>
    );
  }

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      style={{ width: size, height: size, overflow: "hidden" }}
    >
      <Animated.View
        style={{
          ...geometry,
          transformOrigin: `${circle / 2}px ${originY}px`,
          transform: [
            {
              rotate: spin.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        }}
      />
    </View>
  );
};

export default EclipseLoader;
