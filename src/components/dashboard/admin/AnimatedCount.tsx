import { useEffect, useRef, useState } from "react";
import { Animated, Text, type TextStyle } from "react-native";

import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { EASING, useReducedMotion } from "@/theme/motion";

type Props = {
  value: number;
  className?: string;
  style?: TextStyle;
};

const DURATION_MS = 450;

/**
 * A count that rolls to its new value when live data changes it, so a change
 * is noticed without a banner. The first value shows as is (no count-up on
 * every visit), and reduced motion swaps the number instantly.
 */
const AnimatedCount = ({ value, className, style }: Props) => {
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(value);
  const progress = useAnimatedValue(value);
  const settled = useRef(value);

  useEffect(() => {
    if (value === settled.current) return;
    const from = settled.current;
    settled.current = value;

    if (reducedMotion) {
      progress.setValue(value);
      return;
    }

    progress.setValue(from);
    const listener = progress.addListener(({ value: current }) => setShown(Math.round(current)));
    const animation = Animated.timing(progress, {
      toValue: value,
      duration: DURATION_MS,
      easing: EASING.out,
      // The number is text, which only the JS driver can update.
      useNativeDriver: false,
    });
    animation.start(() => setShown(value));
    return () => {
      animation.stop();
      progress.removeListener(listener);
    };
  }, [value, reducedMotion, progress]);

  return (
    <Text className={className} style={style} accessibilityLabel={value.toLocaleString()}>
      {(reducedMotion ? value : shown).toLocaleString()}
    </Text>
  );
};

export default AnimatedCount;
