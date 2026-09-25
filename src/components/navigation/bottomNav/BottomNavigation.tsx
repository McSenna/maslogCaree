import { usePathname } from "expo-router";
import { View, useWindowDimensions } from "react-native";
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
  items: BottomNavEntry[];
  replace?: boolean;
};

const BottomNavigation = ({ items, replace = false }: BottomNavigationProps) => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const theme = useOptionalTheme();
  const palette = getBottomNavPalette(theme?.resolvedTheme ?? "light");
  const keyboardVisible = useKeyboardVisible();
  const { width } = useWindowDimensions();
  const tabWidth = (width - BOTTOM_NAV_METRICS.paddingHorizontal * 2) / Math.max(items.length, 1);
  const labelSize = tabWidth < 60 ? BOTTOM_NAV_METRICS.labelSizeCompact : BOTTOM_NAV_METRICS.labelSize;

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
          labelSize={labelSize}
        />
      ))}
    </View>
  );
};

export default BottomNavigation;
