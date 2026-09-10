import { useState, type ReactNode } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import { ANDROID_RIPPLE } from "./authCardMetrics";
import { authCardStyles } from "./authCardStyles";

type AuthActionButtonProps = {
  accessibilityLabel: string;
  onPress?: () => void;
  disabled?: boolean;
  height: number;
  marginBottom: number;
  backgroundColor: string;
  /** The button's own base style — `loginButton` or `createButton`. */
  baseStyle: StyleProp<ViewStyle>;
  /** Held pressed while a request is in flight. */
  forcePressed?: boolean;
  children: ReactNode;
};

/**
 * A primary action on the login card.
 *
 * Press state is held here rather than read from `Pressable`'s function-style
 * `style` prop: that form rendered as an unstyled view on Android in Expo Go,
 * and the buttons lost their background and height entirely.
 */
export default function AuthActionButton({
  accessibilityLabel,
  onPress,
  disabled = false,
  height,
  marginBottom,
  backgroundColor,
  baseStyle,
  forcePressed = false,
  children,
}: AuthActionButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      android_ripple={ANDROID_RIPPLE}
      style={[
        baseStyle,
        { height, marginBottom, backgroundColor },
        (pressed || forcePressed) && authCardStyles.buttonPressed,
      ]}
    >
      {children}
    </Pressable>
  );
}
