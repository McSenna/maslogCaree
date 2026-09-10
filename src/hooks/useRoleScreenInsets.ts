import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { ROLE_LAYOUT_PADDING } from "@/components/layout/RoleLayout";
import { BREAKPOINTS } from "@/constants/breakpoints";

/**
 * The spacing a role page wants, minus what the shell already applied.
 *
 * `RoleLayout` pads its content area, but each page wants its own rhythm — a
 * wider gutter on desktop, more room under the last card on a phone. Adding
 * that padding on top of the shell's would double it, so every page subtracts
 * what the shell contributes and asks only for the difference. That arithmetic
 * was copied into six screens; it lives here once so Inventory, User
 * Management, System Logs, the admin dashboard and both queue screens line up
 * under the header and against the sidebar instead of each sitting at its own
 * inset.
 */
export function useRoleScreenInsets() {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const isPhone = width < BREAKPOINTS.tablet;
    const layoutPadding = isPhone ? ROLE_LAYOUT_PADDING.mobile : ROLE_LAYOUT_PADDING.desktop;
    const desktopGutter = width >= BREAKPOINTS.desktop ? 32 : 24;

    return {
      width,
      isPhone,
      layoutPadding,
      /** Horizontal padding for the page's own scroll content. */
      gutter: Math.max(0, (isPhone ? 16 : desktopGutter) - layoutPadding.horizontal),
      paddingTop: Math.max(0, (isPhone ? 16 : 24) - layoutPadding.top),
      paddingBottom: Math.max(0, (isPhone ? 28 : 32) - layoutPadding.bottom),
    };
  }, [width]);
}

export type RoleScreenInsets = ReturnType<typeof useRoleScreenInsets>;
