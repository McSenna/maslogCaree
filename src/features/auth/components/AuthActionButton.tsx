import { useEffect, useRef, type ReactNode } from "react";
import { Animated, type StyleProp, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedPressable } from "@/components/landing/motion/landingMotion";
import { useInteractiveLift } from "@/components/landing/motion/useInteractiveLift";
import { ANDROID_RIPPLE } from "./authCardMetrics";
import { authCardStyles } from "./authCardStyles";
import { USE_NATIVE_DRIVER } from "@/design/motion";

type AuthActionButtonProps = {
  accessibilityLabel: string;
  onPress?: () => void;
  disabled?: boolean;
  height: number;
  marginBottom: number;
  backgroundColor: string;
  baseStyle: StyleProp<ViewStyle>;
  forcePressed?: boolean;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  children: ReactNode;
};

const ICON_SHIFT = 4;

const AuthActionButton = ({
  accessibilityLabel,
  onPress,
  disabled = false,
  height,
  marginBottom,
  backgroundColor,
  baseStyle,
  forcePressed = false,
  trailingIcon,
  children,
}: AuthActionButtonProps) => {
  const lift = useInteractiveLift({ lift: 2, pressScale: 0.985 });
  const iconShift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.spring(iconShift, {
      toValue: lift.hovered && !disabled ? ICON_SHIFT : 0,
      useNativeDriver: USE_NATIVE_DRIVER,
      speed: 26,
      bounciness: 0,
    });

    animation.start();

    return () => animation.stop();
  }, [lift.hovered, disabled, iconShift]);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, busy: forcePressed }}
      onPress={onPress}
      disabled={disabled}
      android_ripple={ANDROID_RIPPLE}
      {...lift.handlers}
      style={[
        baseStyle,
        { height, marginBottom, backgroundColor },
        lift.hovered && !disabled && authCardStyles.buttonHovered,
        (lift.pressed || forcePressed) && authCardStyles.buttonPressed,
        disabled && !forcePressed && authCardStyles.buttonDisabled,
        lift.liftStyle,
      ]}
    >
      {children}

      {trailingIcon ? (
        <Animated.View style={{ transform: [{ translateX: iconShift }] }}>
          <Ionicons name={trailingIcon} size={17} color="#FFFFFF" />
        </Animated.View>
      ) : null}
    </AnimatedPressable>
  );
};

export default AuthActionButton;
