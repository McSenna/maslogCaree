import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useNavLinkPress } from "../useNavLinkPress";
import { useEffect } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { BOTTOM_NAV_ROW_HEIGHT } from "@/constants/layout";
import NotificationBadge from "./NotificationBadge";
import {
  BOTTOM_NAV_METRICS,
  BOTTOM_NAV_TIMING,
  type BottomNavPalette,
} from "./bottomNavTokens";
import type { BottomNavEntry } from "./types";
import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

type BottomNavItemProps = {
  item: BottomNavEntry;
  isActive: boolean;
  palette: BottomNavPalette;
  replace?: boolean;
  labelSize?: number;
};

const BottomNavItem = ({
  item,
  isActive,
  palette,
  replace = false,
  labelSize = BOTTOM_NAV_METRICS.labelSize,
}: BottomNavItemProps) => {
  const reducedMotion = useReducedMotion();
  const activeAnim = useAnimatedValue(isActive ? 1 : 0);
  const pressAnim = useAnimatedValue(1);

  useEffect(() => {
    Animated.timing(activeAnim, {
      toValue: isActive ? 1 : 0,
      duration: BOTTOM_NAV_TIMING.active,
      easing: EASING.out,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [isActive, activeAnim]);

  const animatePress = (toValue: number) => {
    if (reducedMotion) return;
    Animated.timing(pressAnim, {
      toValue,
      duration: toValue < 1 ? TIMING.pressIn : TIMING.pressOut,
      easing: EASING.out,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  };

  const iconScale = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, reducedMotion ? 1 : 1.06],
  });

  const color = isActive ? palette.active : palette.inactive;

  const handlePress = useNavLinkPress(item.href, replace);

  return (
    <Link href={item.href as never} asChild replace={replace} onPress={handlePress}>
      <Pressable
        accessibilityRole="tab"
        accessibilityLabel={item.accessibilityLabel ?? item.label}
        accessibilityState={{ selected: isActive }}
        accessibilityHint={
          item.badgeCount && item.badgeCount > 0
            ? `${item.badgeCount} unread`
            : undefined
        }
        onPressIn={() => animatePress(0.96)}
        onPressOut={() => animatePress(1)}
        android_ripple={{
          color: `${palette.active}14`,
          borderless: true,
          radius: 32,
        }}
        style={{
          flex: 1,
          minHeight: Math.max(
            BOTTOM_NAV_ROW_HEIGHT,
            BOTTOM_NAV_METRICS.touchTarget
          ),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View
          style={{
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "100%",
            paddingHorizontal: 2,
            transform: [{ scale: pressAnim }],
          }}
        >
          <View
            style={{
              height: BOTTOM_NAV_METRICS.pillHeight,
              minWidth: BOTTOM_NAV_METRICS.pillMinWidth,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                borderRadius: BOTTOM_NAV_METRICS.pillRadius,
                backgroundColor: palette.activePill,
                opacity: activeAnim,
              }}
            />

            <Animated.View
              style={{
                width: BOTTOM_NAV_METRICS.iconBox,
                height: BOTTOM_NAV_METRICS.iconBox,
                alignItems: "center",
                justifyContent: "center",
                transform: [{ scale: iconScale }],
              }}
            >
              <Feather
                name={item.icon}
                size={BOTTOM_NAV_METRICS.iconSize}
                color={color}
              />

              <NotificationBadge
                count={item.badgeCount ?? 0}
                palette={palette}
                surface={palette.surface}
              />
            </Animated.View>
          </View>
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
            style={{
              marginTop: 2,
              maxWidth: "100%",
              fontSize: labelSize,
              lineHeight: labelSize + 3,
              fontWeight: isActive ? "700" : "500",
              color,
            }}
          >
            {item.shortLabel ?? item.label}
          </Text>
        </Animated.View>
      </Pressable>
    </Link>
  );
};

export default BottomNavItem;
