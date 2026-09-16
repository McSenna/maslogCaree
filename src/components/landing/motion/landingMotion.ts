import { Animated, Easing, Pressable } from "react-native";

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ENTER_DISTANCE = 14;

export const ENTER_DURATION = 420;

export const STAGGER_STEP = 70;

export const FLOAT_DISTANCE = 8;

export const FLOAT_DURATION = 5200;

export const LIFT_SPRING = { speed: 26, bounciness: 0 } as const;

export const enterEasing = Easing.out(Easing.cubic);

export const floatEasing = Easing.inOut(Easing.sin);

export const staggerDelay = (index: number, base = 0): number =>
  base + index * STAGGER_STEP;
