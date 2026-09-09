import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { BOTTOM_NAV_ROW_HEIGHT } from "@/constants/layout";
import NotificationBadge from "./NotificationBadge";
import {
  BOTTOM_NAV_METRICS,
  BOTTOM_NAV_TIMING,
  type BottomNavPalette,
} from "./bottomNavTokens";
import type { BottomNavEntry } from "./types";

type BottomNavItemProps = {
  item: BottomNavEntry;
  isActive: boolean;
  palette: BottomNavPalette;
  /** Replace the history entry instead of pushing (public marketing tabs). */
  replace?: boolean;
};

/**
 * A single tab: soft blue pill behind the icon when active, muted slate when
 * not. Every tab is `flex: 1`, so 3 through 6 of them stay evenly balanced —
 * six is the most any role carries, and at 360px that still leaves each tab
 * wider than the active pill it has to hold.
 *
 * Icon-only by design — `item.label` is still what a screen reader announces.
 */
const BottomNavItem = ({
  item,
  isActive,
  palette,
  replace = false,
}: BottomNavItemProps) => {
  const activeAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(activeAnim, {
      toValue: isActive ? 1 : 0,
      duration: BOTTOM_NAV_TIMING.active,
      useNativeDriver: true,
    }).start();
  }, [isActive, activeAnim]);

  const animatePress = (toValue: number) => {
    Animated.timing(pressAnim, {
      toValue,
      duration: BOTTOM_NAV_TIMING.press,
      useNativeDriver: true,
    }).start();
  };

  // A single restrained lift on selection — no bounce, no oversized scaling.
  const iconScale = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const color = isActive ? palette.active : palette.inactive;

  return (
    <Link href={item.href as never} asChild replace={replace}>
      <Pressable
        accessibilityRole="tab"
        accessibilityLabel={item.accessibilityLabel ?? `${item.label} tab`}
        accessibilityState={{ selected: isActive }}
        accessibilityHint={
          item.badgeCount && item.badgeCount > 0
            ? `${item.badgeCount} unread`
            : undefined
        }
        onPressIn={() => animatePress(0.94)}
        onPressOut={() => animatePress(1)}
        // Ripple stays inside the pill radius instead of flooding the tab.
        android_ripple={{
          color: `${palette.active}14`,
          borderless: true,
          radius: 32,
        }}
        style={{
          // Equal width for every tab, and a row taller than the 48px minimum
          // touch target — the whole cell is tappable, not just the glyph.
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
        </Animated.View>
      </Pressable>
    </Link>
  );
};

export default BottomNavItem;
