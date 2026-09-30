import { Animated, Pressable } from "react-native";
import { EASING } from "@/theme/motion";

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ENTER_DISTANCE = 12;

export const ENTER_DURATION = 380;

export const LIFT_SPRING = { speed: 26, bounciness: 0 } as const;

export const enterEasing = EASING.out;

