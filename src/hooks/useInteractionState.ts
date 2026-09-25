import { useCallback, useMemo, useState } from "react";
import { Animated, Platform, type NativeSyntheticEvent, type TargetedEvent } from "react-native";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { EASING, PRESS_SCALE, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";

type FocusTarget = { matches?: (selector: string) => boolean };

const isKeyboardFocus = (event: NativeSyntheticEvent<TargetedEvent>): boolean => {
  if (Platform.OS !== "web") return true;
  const target = event.target as unknown as FocusTarget | null;
  try {
    return target?.matches?.(":focus-visible") ?? true;
  } catch {
    return true;
  }
};

export const useInteractionState = ({
  disabled = false,
  pressScale = PRESS_SCALE,
}: { disabled?: boolean; pressScale?: number } = {}) => {
  const reducedMotion = useReducedMotion();
  const scale = useAnimatedValue(1);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const animateTo = useCallback(
    (toValue: number) => {
      if (reducedMotion) return;
      Animated.timing(scale, {
        toValue,
        duration: toValue < 1 ? TIMING.pressIn : TIMING.pressOut,
        easing: EASING.out,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    },
    [reducedMotion, scale]
  );

  const handlers = useMemo(
    () => ({
      onPressIn: () => {
        if (disabled) return;
        setPressed(true);
        animateTo(pressScale);
      },
      onPressOut: () => {
        setPressed(false);
        animateTo(1);
      },
      onHoverIn: () => setHovered(true),
      onHoverOut: () => setHovered(false),
      onFocus: (event: NativeSyntheticEvent<TargetedEvent>) => setFocused(isKeyboardFocus(event)),
      onBlur: () => setFocused(false),
    }),
    [animateTo, disabled, pressScale]
  );

  return {
    hovered: hovered && !disabled,
    focused,
    pressed,
    scaleStyle: { transform: [{ scale }] },
    handlers,
  };
};
