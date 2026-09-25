import type { Feather } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import { View } from "react-native";
import SidebarBrand from "./sidebar/SidebarBrand";
import SidebarBranding from "./sidebar/SidebarBranding";
import SidebarDecorations from "./sidebar/SidebarDecorations";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavItem from "./sidebar/SidebarNavItem";
import { SIDEBAR_METRICS, getSidebarWidth, useSidebarPalette } from "./sidebar/sidebarTheme";
import { useResponsive } from "@/hooks/useResponsive";

export type NavItem = {
  label: string;
  shortLabel?: string;
  href: string;
  icon: keyof typeof Feather.glyphMap;
};

type SidebarNavigationProps = {
  items: NavItem[];
  roleLabel: string;
};

const isCurrentRoute = (pathname: string, href: string): boolean => {
  if (pathname === href) return true;
  if (!href.endsWith("/dashboard")) return false;
  const root = href.replace(/\/dashboard$/, "");
  return pathname === root || pathname === `${root}/`;
};

const SidebarNavigation = ({ items, roleLabel }: SidebarNavigationProps) => {
  const { breakpoint, isTablet } = useResponsive();
  const sidebarWidth = getSidebarWidth(breakpoint);
  const pathname = usePathname();
  const palette = useSidebarPalette();

  return (
    <View
      className="h-full shrink-0 overflow-hidden border-r"
      style={{
        width: sidebarWidth,
        backgroundColor: palette.surface,
        borderRightColor: palette.border,
      }}
    >
      <SidebarDecorations palette={palette} />

      <View
        className="flex-1"
        style={{
          paddingHorizontal: isTablet ? 12 : SIDEBAR_METRICS.paddingX,
          paddingTop: 24,
          paddingBottom: 34,
        }}
      >
        <SidebarBrand palette={palette} />

        <View style={{ marginTop: 26 }}>
          <SidebarHeader roleLabel={roleLabel} palette={palette} />
        </View>

        <View className="w-full" style={{ marginTop: 12, gap: SIDEBAR_METRICS.itemGap }}>
          {items.map((item) => (
            <SidebarNavItem
              key={item.href}
              label={item.label}
              icon={item.icon}
              href={item.href}
              isActive={isCurrentRoute(pathname, item.href)}
              palette={palette}
            />
          ))}
        </View>

        <View className="flex-1" />

        <SidebarBranding palette={palette} />
      </View>
    </View>
  );
};

export default SidebarNavigation;
