import { useMemo } from "react";
import { ROLE_LAYOUT_PADDING } from "@/constants/layout";
import { useResponsive } from "@/hooks/useResponsive";

export const useRoleScreenInsets = () => {
  const { width, isMobile, pagePadding } = useResponsive();

  return useMemo(() => {
    const layoutPadding = isMobile ? ROLE_LAYOUT_PADDING.mobile : ROLE_LAYOUT_PADDING.desktop;

    return {
      width,
      isPhone: isMobile,
      layoutPadding,
      gutter: Math.max(0, pagePadding - layoutPadding.horizontal),
      paddingTop: Math.max(0, (isMobile ? 16 : 24) - layoutPadding.top),
      paddingBottom: Math.max(0, (isMobile ? 28 : 32) - layoutPadding.bottom),
    };
  }, [width, isMobile, pagePadding]);
};

export type RoleScreenInsets = ReturnType<typeof useRoleScreenInsets>;
