import { useRouter } from "expo-router";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { getProfilePath, type UserRole } from "@/data/mockUsers";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import RoleBottomNav from "../navigation/RoleBottomNav";
import SidebarNavigation from "../navigation/SidebarNavigation";
import type { NavItem } from "../navigation/SidebarNavigation";
import UserAvatar from "../ui/UserAvatar";
import {
  NotificationBell,
  NotificationPanel,
  type BellPosition,
} from "@/components/notifications";
import { useNotifications } from "@/hooks/useNotifications";

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
  title,
}: RoleLayoutProps) => {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const { user } = useAuth();
  const router = useRouter();
  const { resolvedTheme, classes } = useTheme();

  const {
    notifications,
    unreadCount,
    loading: notifLoading,
    error: notifError,
    refresh: notifRefresh,
    markRead,
    markAllRead,
  } = useNotifications();

  const [notifOpen, setNotifOpen] = useState(false);
  const [bellPosition, setBellPosition] = useState<BellPosition | null>(null);

  const handleBellMeasure = useCallback((pos: BellPosition) => {
    setBellPosition(pos);
  }, []);

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
   * Theme colors
   */
  const safeBg =
    resolvedTheme === "dark"
      ? "#020617"
      : "#FFFFFF";

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: safeBg,
      }}
      edges={["top"]}
    >
      {/* ROOT LAYOUT */}
      <View
        className={`flex-1 flex-row w-full min-w-0 ${classes.screenBg}`}
      >
        {/* =====================================================
            DESKTOP SIDEBAR
        ====================================================== */}
        {!isMobile && (
          <SidebarNavigation
            items={sidebarItems}
            roleLabel={roleLabel}
          />
        )}

        <View className="flex-1 min-w-0 w-full">

          {/* ===================================================
              HEADER
          ==================================================== */}
          <View
            className={[
              classes.headerBar,
              "shadow-md",
              "w-full",
            ].join(" ")}
          >
            <View
              className="
                w-full
                flex-row
                items-center
                justify-between
                px-4
                py-3
                md:px-6
                md:py-4
              "
            >
              {/* PAGE TITLE */}
              <Text
                className={`
                  text-base
                  font-bold
                  tracking-tight
                  md:text-lg
                  ${classes.headerTitle}
                `}
              >
                {/* {title ?? roleLabel} */}
              </Text>

              {/* HEADER ACTIONS */}
              <View className="flex-row items-center gap-3">

                <NotificationBell
                  unreadCount={unreadCount}
                  onPress={() => setNotifOpen(true)}
                  onMeasure={handleBellMeasure}
                />

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open profile"
                  onPress={() => {
                    if (!user) return;

                    router.push(
                      getProfilePath(
                        user.role as UserRole
                      ) as any
                    );
                  }}
                  className="
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/30
                    bg-white/10
                    active:bg-white/15
                  "
                  style={({ pressed }) => ({
                    transform: [
                      {
                        scale: pressed ? 0.96 : 1,
                      },
                    ],
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <UserAvatar
                    size={40}
                    imageUrl={user?.avatarUrl ?? null}
                    accessibilityLabel="Profile photo"
                  />
                </Pressable>
              </View>
            </View>
          </View>


          <NotificationPanel
            visible={notifOpen}
            onClose={() => setNotifOpen(false)}
            items={notifications}
            unreadCount={unreadCount}
            loading={notifLoading}
            error={notifError}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
            onRefresh={notifRefresh}
            bellPosition={bellPosition}
          />

          <View
            key={layoutEpoch}
            className={`
              flex-1
              w-full
              min-w-0
              ${classes.scrollBg}
            `}
            style={{
              paddingHorizontal: isMobile ? 7 : 24,
              paddingTop: isMobile ? 7 : 20,
              paddingBottom: isMobile ? 30 : 24,
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
        <RoleBottomNav
          items={bottomNavItems}
        />
      )}
    </SafeAreaView>
  );
};

export default RoleLayout;