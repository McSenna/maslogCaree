import { useEffect } from "react";
import { Animated, Platform, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LANDING_COLORS } from "@/config/landingAssets";
import { AnimatedPressable } from "../motion/landingMotion";
import { useInteractiveLift } from "../motion/useInteractiveLift";
import { USE_NATIVE_DRIVER } from "@/theme/motion";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

type HeroActionButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  variant: "primary" | "secondary";
  fullWidth?: boolean;
  height?: number;
};

const ICON_SHIFT = 4;

const HeroActionButton = ({
  label,
  icon,
  onPress,
  variant,
  fullWidth = false,
  height = 52,
}: HeroActionButtonProps) => {
  const lift = useInteractiveLift({ lift: 2, pressScale: 0.98 });
  const iconShift = useAnimatedValue(0);

  const isPrimary = variant === "primary";
  const foreground = isPrimary ? LANDING_COLORS.white : LANDING_COLORS.primaryBlue;

  useEffect(() => {
    const animation = Animated.spring(iconShift, {
      toValue: lift.hovered ? ICON_SHIFT : 0,
      useNativeDriver: USE_NATIVE_DRIVER,
      speed: 26,
      bounciness: 0,
    });

    animation.start();

    return () => animation.stop();
  }, [lift.hovered, iconShift]);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      {...lift.handlers}
      style={[
        styles.button,
        { minHeight: height },
        isPrimary ? styles.primary : styles.secondary,
        fullWidth && styles.fullWidth,
        lift.hovered && (isPrimary ? styles.primaryHovered : styles.secondaryHovered),
        lift.liftStyle,
      ]}
    >
      <Text style={[styles.label, { color: foreground }]}>{label}</Text>
      <Animated.View style={{ transform: [{ translateX: iconShift }] }}>
        <Ionicons name={icon} size={17} color={foreground} />
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 24,
    borderRadius: 13,
    ...Platform.select({
      web: {
        cursor: "pointer",
        transition: "background-color 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
      },
    }),
  },
  fullWidth: {
    flex: 1,
  },
  primary: {
    backgroundColor: LANDING_COLORS.primaryBlue,
    ...Platform.select({
      web: { boxShadow: "0px 8px 20px rgba(8, 102, 245, 0.22)" },
      default: { elevation: 3 },
    }),
  },
  primaryHovered: {
    ...Platform.select({
      web: { boxShadow: "0px 14px 28px rgba(8, 102, 245, 0.30)" },
    }),
  },
  secondary: {
    backgroundColor: LANDING_COLORS.white,
    borderWidth: 1.5,
    borderColor: LANDING_COLORS.border,
  },
  secondaryHovered: {
    borderColor: LANDING_COLORS.primaryBlue,
    ...Platform.select({
      web: { boxShadow: "0px 10px 22px rgba(8, 21, 47, 0.10)" },
    }),
  },
  label: {
    fontSize: 15.5,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
});

export default HeroActionButton;
