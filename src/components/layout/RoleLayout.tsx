import { useRouter } from "expo-router";
import { ReactNode, useEffect, useRef, useState } from "react";
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

  const [layoutEpoch, setLayoutEpoch] = useState(0);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (appStateRef.current.match(/inactive|background/) && next === "active") {
        setLayoutEpoch((n) => n + 1);
      }
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, []);

  const safeBg = resolvedTheme === "dark" ? "#020617" : "#f1f5f9";

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: safeBg }} edges={["top"]}>
      <View className={`flex-1 flex-row ${classes.screenBg}`}>
        {!isMobile && (
          <SidebarNavigation items={sidebarItems} roleLabel={roleLabel} />
        )}

        <View className="flex-1">
          <View className={[classes.headerBar, "shadow-md"].join(" ")}>
            <View className="flex-row items-center justify-between px-4 py-3 md:px-6 md:py-4">
              <Text className={`text-base font-bold tracking-tight md:text-lg ${classes.headerTitle}`}>
                {title ?? roleLabel}
              </Text>

              <View className="flex-row items-center gap-2">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open profile"
                  onPress={() => {
                    if (!user) return;
                    router.push(getProfilePath(user.role as UserRole) as any);
                  }}
                  className="h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 active:bg-white/15"
                  style={({ pressed }) => ({
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <UserAvatar
                    size={34}
                    imageUrl={user?.avatarUrl ?? null}
                    accessibilityLabel="Profile photo"
                  />
                </Pressable>
              </View>
            </View>
          </View>

          <View
            key={layoutEpoch}
            className={`flex-1 ${classes.scrollBg}`}
            style={{
              padding: isMobile ? 16 : 24,
              paddingBottom: isMobile ? 80 : 24,
            }}
          >
            {children}
          </View>
        </View>
      </View>

      {isMobile && <RoleBottomNav items={bottomNavItems} />}
    </SafeAreaView>
  );
};

export default RoleLayout;
