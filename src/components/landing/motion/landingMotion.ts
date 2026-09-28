import { Animated, Pressable } from "react-native";
import { EASING } from "@/theme/motion";

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ENTER_DISTANCE = 12;

export const ENTER_DURATION = 380;

export const STAGGER_STEP = 60;

export const LIFT_SPRING = { speed: 26, bounciness: 0 } as const;

export const enterEasing = EASING.out;

export const staggerDelay = (index: number, base = 0): number =>
  base + index * STAGGER_STEP;
