import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { ROLE_LAYOUT_PADDING } from "@/components/layout/RoleLayout";
import { BREAKPOINTS } from "@/constants/breakpoints";

export const useRoleScreenInsets = () => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const isPhone = width < BREAKPOINTS.tablet;
    const layoutPadding = isPhone ? ROLE_LAYOUT_PADDING.mobile : ROLE_LAYOUT_PADDING.desktop;
    const desktopGutter = width >= BREAKPOINTS.desktop ? 32 : 24;

    return {
      width,
      isPhone,
      layoutPadding,
      gutter: Math.max(0, (isPhone ? 16 : desktopGutter) - layoutPadding.horizontal),
      paddingTop: Math.max(0, (isPhone ? 16 : 24) - layoutPadding.top),
      paddingBottom: Math.max(0, (isPhone ? 28 : 32) - layoutPadding.bottom),
    };
  }, [width]);
};

export type RoleScreenInsets = ReturnType<typeof useRoleScreenInsets>;
