import type { Feather } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import { View } from "react-native";
import SidebarBrand from "./sidebar/SidebarBrand";
import SidebarBranding from "./sidebar/SidebarBranding";
import SidebarDecorations from "./sidebar/SidebarDecorations";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavItem from "./sidebar/SidebarNavItem";
import { SIDEBAR_METRICS, SIDEBAR_WIDTH, useSidebarPalette } from "./sidebar/sidebarTheme";

export type NavItem = {
  label: string;
  href: string;
  icon: keyof typeof Feather.glyphMap;
};

type SidebarNavigationProps = {
  items: NavItem[];
  roleLabel: string;
};

/**
 * Whether a nav entry is the page currently open.
 *
 * A role's dashboard is also its index route, so `/doctor` and `/doctor/` have
 * to light the Dashboard entry as well — otherwise landing on the workspace
 * shows a sidebar with nothing selected. Derived from the URL rather than held
 * in state, so the selection survives a refresh, a typed address and the
 * browser's back and forward buttons.
 */
function isCurrentRoute(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (!href.endsWith("/dashboard")) return false;
  const root = href.replace(/\/dashboard$/, "");
  return pathname === root || pathname === `${root}/`;
}

/**
 * The desktop workspace sidebar.
 *
 * A calm rail rather than a dense control panel: the barangay's identity at the
 * head, the signed-in role's destinations beneath it, and a lot of quiet before
 * the closing line. The empty space is the design — a health worker glances
 * here to move between a handful of places, and anything else added to it would
 * be read every time and needed almost never.
 *
 * Because the identity lives here, the header beside it is free to be a thin
 * bar of controls rather than repeating the branding on every page.
 *
 * Part of the page rather than a card floating on it: square corners, one
 * hairline on the inside edge, no shadow.
 *
 * Rendered only on desktop by the shell; phones get the bottom bar instead.
 */
const SidebarNavigation = ({ items, roleLabel }: SidebarNavigationProps) => {
  const pathname = usePathname();
  const palette = useSidebarPalette();

  return (
    // `shrink-0` beside the content's `flex-1 min-w-0` is what keeps the main
    // column off the sidebar without any margin arithmetic.
    <View
      className="h-full shrink-0 overflow-hidden border-r"
      style={{
        width: SIDEBAR_WIDTH,
        backgroundColor: palette.surface,
        borderRightColor: palette.border,
      }}
    >
      <SidebarDecorations palette={palette} />

      <View
        className="flex-1"
        style={{
          paddingHorizontal: SIDEBAR_METRICS.paddingX,
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

        {/* The quiet middle. `flex-1` here is what pins the branding to the
            bottom edge at any viewport height, with no fixed offsets. */}
        <View className="flex-1" />

        <SidebarBranding palette={palette} />
      </View>
    </View>
  );
};

export default SidebarNavigation;
