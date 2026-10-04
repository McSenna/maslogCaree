import { useEffect, useState, type ReactNode } from "react";
import { Animated, View, useWindowDimensions, type LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MENU_SHADOW } from "@/design/adminSurfaces";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { EASING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";

import type { MenuAnchor } from "../../userAdmin.types";
import { placeMenu } from "./menuPlacement";

const ENTER_MS = 140;

type MenuCardProps = { anchor: MenuAnchor; label: string; children: ReactNode };

/**
 * The menu surface. It is measured hidden first, then placed beside the button
 * (flipped up near the bottom edge) and fades in with a slight scale from the
 * button's corner, so it never appears in the wrong spot or with a jump.
 */
const MenuCard = ({ anchor, label, children }: MenuCardProps) => {
  const viewport = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const progress = useAnimatedValue(0);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!size) return;
    if (reducedMotion) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, { toValue: 1, duration: ENTER_MS, easing: EASING.out, useNativeDriver: USE_NATIVE_DRIVER });
    animation.start();
    return () => animation.stop();
  }, [size, reducedMotion, progress]);

  const measure = ({ nativeEvent }: LayoutChangeEvent) => {
    if (!size) setSize({ width: nativeEvent.layout.width, height: nativeEvent.layout.height });
  };

  const place = size ? placeMenu(anchor, size, viewport, insets) : null;
  // Dynamic position and motion only; the look lives on the inner View (className is ignored on Animated.View on web).
  const frame = {
    position: "absolute" as const,
    // Above the dismiss layer, which comes later in the tree so focus starts here.
    zIndex: 1,
    top: place?.top ?? anchor.y,
    left: place?.left ?? anchor.x,
    opacity: progress,
    transformOrigin: place?.flipped ? "bottom right" : "top right",
    transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }],
  };

  return (
    <Animated.View onLayout={measure} style={frame}>
      <View accessibilityRole="menu" accessibilityLabel={label} style={MENU_SHADOW} className="w-[210px] rounded-control border border-line bg-canvas p-1">
        {children}
      </View>
    </Animated.View>
  );
};

export default MenuCard;
