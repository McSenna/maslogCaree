import { forwardRef, useState } from "react";
import {
  Pressable,
  type GestureResponderEvent,
  type MouseEvent,
  type PressableProps,
  type StyleProp,
  type View,
  type ViewStyle,
} from "react-native";

export type PressState = { pressed: boolean; hovered: boolean };

type Props = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle> | ((state: PressState) => StyleProp<ViewStyle>);
};

/**
 * A Pressable whose style may depend on pressed and hovered, for use wherever
 * `style={({ pressed }) => ...}` would be written.
 *
 * NativeWind's css-interop wraps every Pressable on native and treats a style
 * function as a plain inline style, so the function's result never reaches the
 * view: chips lost their background, padding and row layout on Android while
 * web looked right. Resolving the function here hands Pressable a plain style.
 */
const StatePressable = forwardRef<View, Props>(
  ({ style, onPressIn, onPressOut, onHoverIn, onHoverOut, ...rest }, ref) => {
    const [pressed, setPressed] = useState(false);
    const [hovered, setHovered] = useState(false);

    return (
      <Pressable
        ref={ref}
        {...rest}
        onPressIn={(event: GestureResponderEvent) => {
          setPressed(true);
          onPressIn?.(event);
        }}
        onPressOut={(event: GestureResponderEvent) => {
          setPressed(false);
          onPressOut?.(event);
        }}
        onHoverIn={(event: MouseEvent) => {
          setHovered(true);
          onHoverIn?.(event);
        }}
        onHoverOut={(event: MouseEvent) => {
          setHovered(false);
          onHoverOut?.(event);
        }}
        style={typeof style === "function" ? style({ pressed, hovered }) : style}
      />
    );
  }
);

StatePressable.displayName = "StatePressable";

export default StatePressable;
