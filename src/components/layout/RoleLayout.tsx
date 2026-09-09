import { ReactNode, useEffect, useRef, useState } from "react";
import { AppState, useWindowDimensions, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/contexts/ThemeContext";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { useAuth } from "@/contexts/AuthContext";
import { getNotificationsPath, type UserRole } from "@/data/mockUsers";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { getBottomContentPadding } from "@/constants/layout";
import { useBottomNavMetrics } from "@/components/navigation/bottomNav";
import { AppHeader } from "@/components/header";
import { getHeaderPalette } from "@/components/header/headerTokens";
import RoleBottomNav from "../navigation/RoleBottomNav";
import SidebarNavigation from "../navigation/SidebarNavigation";
import type { NavItem } from "../navigation/SidebarNavigation";

/**
 * Padding applied to the routed screen inside this layout.
 *
 * Exported so a full-bleed screen (the admin dashboard paints its own page
 * background) can cancel it out instead of hard-coding the same numbers.
 */
export const ROLE_LAYOUT_PADDING = {
  mobile: { horizontal: 7, top: 7, bottom: getBottomContentPadding(0) },
  desktop: { horizontal: 24, top: 20, bottom: 24 },
} as const;

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
  const { width } = useWindowDimensions();
  const bottomNav = useBottomNavMetrics();

  // The bottom-nav badge and the web header bell read the same shared count,
  // so opening one notification updates both at once.
  const { user } = useAuth();
  const { unreadCount } = useNotificationsContext();
  const notificationBadges = user
    ? { [getNotificationsPath(user.role as UserRole)]: unreadCount }
    : undefined;

  const isMobile = width < BREAKPOINTS.tablet;

  const { resolvedTheme, classes } = useTheme();
  const isDark = resolvedTheme === "dark";
  const headerPalette = getHeaderPalette(isDark);

  const [layoutEpoch, setLayoutEpoch] = useState(0);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        next === "active"
      ) {
        setLayoutEpoch((n) => n + 1);
      }

      appStateRef.current = next;
    });

    return () => sub.remove();
  }, []);

  /**
   * Root background matches the application header so the status-bar strip the
   * header pads out reads as one continuous surface.
   */
  const safeBg = headerPalette.background;

  /**
   * Safe-area aware bottom clearance for scrollable screens — sourced from the
   * bottom bar itself so the two can never drift apart.
   */
  const mobileBottomPadding = bottomNav.contentPadding;

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: safeBg,
      }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ROOT LAYOUT */}
      <View className={`flex-1 w-full min-w-0 ${classes.screenBg}`}>
        {/* ===================================================
            HEADER — spans the full width above the sidebar
        ==================================================== */}
        <AppHeader />

        <View className="flex-1 flex-row w-full min-w-0">
          {/* =================================================
              DESKTOP SIDEBAR
          ================================================== */}
          {!isMobile && (
            <SidebarNavigation
              items={sidebarItems}
              roleLabel={roleLabel}
            />
          )}

          <View
            key={layoutEpoch}
            className={`
              flex-1
              w-full
              min-w-0
              ${classes.scrollBg}
            `}
            style={{
              paddingHorizontal: isMobile
                ? ROLE_LAYOUT_PADDING.mobile.horizontal
                : ROLE_LAYOUT_PADDING.desktop.horizontal,
              paddingTop: isMobile
                ? ROLE_LAYOUT_PADDING.mobile.top
                : ROLE_LAYOUT_PADDING.desktop.top,
              paddingBottom: isMobile
                ? mobileBottomPadding
                : ROLE_LAYOUT_PADDING.desktop.bottom,
            }}
          >
            {/* FULL WIDTH CHILD CONTAINER */}
            <View className="flex-1 w-full min-w-0">
              {children}
            </View>
          </View>
        </View>
      </View>

      {isMobile && (
        <RoleBottomNav items={bottomNavItems} badges={notificationBadges} />
      )}
    </View>
  );
};

export default RoleLayout;
