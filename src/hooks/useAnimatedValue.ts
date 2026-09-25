import { useState } from "react";
import { Animated } from "react-native";

/**
 * A stable Animated.Value created once per mount.
 * react-native ships its own `useAnimatedValue`, but react-native-web does not export it.
 */
export const useAnimatedValue = (initialValue: number): Animated.Value =>
  useState(() => new Animated.Value(initialValue))[0];
