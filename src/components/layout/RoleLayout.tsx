import { useEffect, useMemo, type ReactNode } from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { useAuth } from "@/contexts/AuthContext";
import { getNotificationsPath, type UserRole } from "@/config/roleRoutes";
import { useResponsive } from "@/hooks/useResponsive";
import { setToastBottomOffset } from "@/components/feedback/toast/toastStore";
import { ROLE_LAYOUT_PADDING } from "@/constants/layout";
import { useBottomNavMetrics } from "@/components/navigation/bottomNav";
import AppHeader from "@/components/header/AppHeader";
import { getHeaderPalette } from "@/components/header/headerTokens";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import AppStatusBar from "./AppStatusBar";
import ResponsiveContainer from "./ResponsiveContainer";
import ScreenTransition from "./ScreenTransition";
import RoleBottomNav from "../navigation/RoleBottomNav";
import SidebarNavigation from "../navigation/SidebarNavigation";
import type { NavItem } from "../navigation/SidebarNavigation";

export { ROLE_LAYOUT_PADDING };

type RoleLayoutProps = {
  children: ReactNode;
  sidebarItems: NavItem[];
  bottomNavItems: NavItem[];
  roleLabel: string;
  title?: string;
};

const RoleLayout = ({
  children,
  sidebarItems,
  bottomNavItems,
  roleLabel,
}: RoleLayoutProps) => {
  const { isMobile } = useResponsive();
  const bottomNav = useBottomNavMetrics();

  const { user } = useAuth();
  const { unreadCount } = useNotificationsContext();
  const notificationsPath = user ? getNotificationsPath(user.role as UserRole) : undefined;
  const navHasNotifications = bottomNavItems.some((item) => item.href === notificationsPath);

  const notificationBadges = useMemo(
    () => (user ? { [getNotificationsPath(user.role as UserRole)]: unreadCount } : undefined),
    [user, unreadCount]
  );

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const headerPalette = getHeaderPalette(isDark);

  const pageSurface = getAdminDashboardPalette(isDark ? "dark" : "light").pageBg;

  const safeBg = headerPalette.background;

  const mobileBottomPadding = bottomNav.contentPadding;

  useEffect(() => {
    setToastBottomOffset(isMobile ? bottomNav.height - bottomNav.bottomInset : 0);
    return () => setToastBottomOffset(0);
  }, [isMobile, bottomNav.height, bottomNav.bottomInset]);

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: safeBg,
      }}
    >
      <AppStatusBar style={isDark ? "light" : "dark"} backgroundColor={safeBg} />

      <View className="flex-1 w-full min-w-0" style={{ backgroundColor: pageSurface }}>

        <View className="w-full md:hidden">
          <AppHeader
            variant="mobile"
            mobileNotificationsHref={navHasNotifications ? undefined : notificationsPath}
          />
        </View>

        <View className="flex-1 flex-row w-full min-w-0">

          <View className="hidden md:flex">
            <SidebarNavigation
              items={sidebarItems}
              roleLabel={roleLabel}
            />
          </View>

          <View className="flex-1 min-w-0">
            <View className="hidden w-full md:flex">
              <AppHeader variant="desktop" />
            </View>

          <View
            className="w-full min-w-0 flex-1 px-[7px] pt-[7px] md:px-6 md:pt-5"
            style={{
              backgroundColor: pageSurface,
              paddingBottom: isMobile
                ? mobileBottomPadding
                : ROLE_LAYOUT_PADDING.desktop.bottom,
            }}
          >
            <ResponsiveContainer padded={false} style={{ flex: 1 }}>
              <ScreenTransition>{children}</ScreenTransition>
            </ResponsiveContainer>
          </View>
          </View>
        </View>
      </View>

      <View className="w-full md:hidden">
        <RoleBottomNav items={bottomNavItems} badges={notificationBadges} />
      </View>
    </View>
  );
};

export default RoleLayout;
