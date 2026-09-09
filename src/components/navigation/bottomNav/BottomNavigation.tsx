import { usePathname } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOptionalTheme } from "@/contexts/ThemeContext";
import {
  BOTTOM_NAV_ROW_HEIGHT,
  BOTTOM_NAV_TOP_PADDING,
  getBottomNavBottomPadding,
} from "@/constants/layout";
import BottomNavItem from "./BottomNavItem";
import { isRouteActive } from "./isRouteActive";
import { useKeyboardVisible } from "./useKeyboardVisible";
import { BOTTOM_NAV_METRICS, getBottomNavPalette } from "./bottomNavTokens";
import type { BottomNavEntry } from "./types";

type BottomNavigationProps = {
  /** 3–5 destinations. More than five stops being a bottom bar. */
  items: BottomNavEntry[];
  replace?: boolean;
};

/**
 * MaslogCare bottom navigation.
 *
 * Docked to the bottom edge and padded by the device's safe-area inset, so it
 * always clears the Android 3-button bar, the gesture pill and the iOS home
 * indicator without any per-device offsets.
 */
const BottomNavigation = ({ items, replace = false }: BottomNavigationProps) => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const theme = useOptionalTheme();
  const palette = getBottomNavPalette(theme?.resolvedTheme ?? "light");
  const keyboardVisible = useKeyboardVisible();

  // Step aside for the keyboard so form controls stay reachable.
  if (items.length === 0 || keyboardVisible) return null;

  return (
    <View
      accessibilityRole="tablist"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        flexDirection: "row",
        alignItems: "stretch",
        minHeight: BOTTOM_NAV_ROW_HEIGHT,
        paddingTop: BOTTOM_NAV_TOP_PADDING,
        paddingBottom: getBottomNavBottomPadding(insets.bottom),
        paddingHorizontal: BOTTOM_NAV_METRICS.paddingHorizontal,
        backgroundColor: palette.surface,
        borderTopWidth: 1,
        borderTopColor: palette.border,
        borderTopLeftRadius: BOTTOM_NAV_METRICS.radius,
        borderTopRightRadius: BOTTOM_NAV_METRICS.radius,
        boxShadow: palette.shadow,
        elevation: 12,
      }}
    >
      {items.map((item) => (
        <BottomNavItem
          key={item.href}
          item={item}
          isActive={isRouteActive(pathname, item.href)}
          palette={palette}
          replace={replace}
        />
      ))}
    </View>
  );
};

export default BottomNavigation;
