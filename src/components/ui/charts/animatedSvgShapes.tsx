import { forwardRef } from "react";
import { Animated, Platform } from "react-native";
import { Circle, Rect, type CircleProps, type RectProps } from "react-native-svg";

/**
 * React Native's animated props hook force-sets `collapsable: false` so the
 * native view is never flattened away from the native driver. On web,
 * react-native-svg's shapes forward every unrecognised prop straight onto the
 * DOM node, where `collapsable` is not a valid attribute — so it is dropped
 * before it reaches the shape, on web only.
 */
const omitCollapsable = <P extends object>(props: P): P => {
  if (!("collapsable" in props)) return props;

  const next: P = { ...props };
  delete (next as { collapsable?: unknown }).collapsable;
  return next;
};

const WebSafeCircle = forwardRef<Circle, CircleProps>((props, ref) => (
  <Circle ref={ref} {...omitCollapsable(props)} />
));
WebSafeCircle.displayName = "WebSafeCircle";

const WebSafeRect = forwardRef<Rect, RectProps>((props, ref) => (
  <Rect ref={ref} {...omitCollapsable(props)} />
));
WebSafeRect.displayName = "WebSafeRect";

const isWeb = Platform.OS === "web";

export const AnimatedCircle = Animated.createAnimatedComponent(isWeb ? WebSafeCircle : Circle);

export const AnimatedRect = Animated.createAnimatedComponent(isWeb ? WebSafeRect : Rect);
