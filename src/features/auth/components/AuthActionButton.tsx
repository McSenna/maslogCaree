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
  baseStyle: StyleProp<ViewStyle>;
  forcePressed?: boolean;
  children: ReactNode;
};

const AuthActionButton = ({
  accessibilityLabel,
  onPress,
  disabled = false,
  height,
  marginBottom,
  backgroundColor,
  baseStyle,
  forcePressed = false,
  children,
}: AuthActionButtonProps) => {
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
};

export default AuthActionButton;
