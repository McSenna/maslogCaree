import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactNode, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
//pages
import { useAuth } from "../../contexts/AuthContext";
import RoleBottomNav from "../navigation/RoleBottomNav";
import SidebarNavigation from "../navigation/SidebarNavigation";
import type { NavItem } from "../navigation/SidebarNavigation";

type RoleLayoutProps = {
  children: ReactNode;
  sidebarItems: NavItem[];
  bottomNavItems: NavItem[];
  roleLabel: string;
  title?: string;
};

export default function RoleLayout({
  children,
  sidebarItems,
  bottomNavItems,
  roleLabel,
  title,
}: RoleLayoutProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { user, logout } = useAuth();
  const router = useRouter();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const avatarRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-8)).current;

  const openDropdown = () => {
    avatarRef.current?.measure((_fx, _fy, w, h, px, py) => {
      setAnchorLayout({ x: px, y: py, width: w, height: h });
      setDropdownVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closeDropdown = (cb?: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -8,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDropdownVisible(false);
      fadeAnim.setValue(0);
      slideAnim.setValue(-8);
      cb?.();
    });
  };

  const handleLogout = async () => {
    if (!logout) {
      console.error("Logout function not available");
      return;
    }

    const performLogout = async () => {
      try {
        await logout();
        router.replace("/");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        performLogout();
      }
    } else {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Logout",
            style: "destructive",
            onPress: performLogout,
          },
        ],
        { cancelable: true }
      );
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <SafeAreaView className="flex-1 bg-mc-text" edges={["top"]}>
      <View className="flex-1 flex-row bg-mc-background">
        {!isMobile && (
          <SidebarNavigation items={sidebarItems} roleLabel={roleLabel} />
        )}

        <View className="flex-1">
          <View className="border-b border-mc-primary/10 bg-mc-primary shadow-md shadow-mc-primary/30">
            <View className="flex-row items-center justify-between px-4 py-3 md:px-6 md:py-4">
              <Text className="text-base font-bold tracking-tight text-white md:text-lg">
                {title ?? roleLabel}
              </Text>

              <Pressable
                ref={avatarRef}
                onPress={openDropdown}
                className="h-9 w-9 items-center justify-center rounded-full border-2 border-white/40 bg-white/20 active:bg-white/30"
              >
                <Text className="text-xs font-extrabold tracking-wide text-white">
                  {initials}
                </Text>
              </Pressable>
            </View>
          </View>

          <View
            className="flex-1"
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

      {dropdownVisible && anchorLayout && (
        <Modal transparent animationType="none" visible={dropdownVisible}>
          <TouchableWithoutFeedback onPress={() => closeDropdown()}>
            <View className="flex-1">
              <Animated.View
                className="absolute min-w-[220px] overflow-hidden rounded-2xl border border-black/5 bg-white"
                style={{
                  top: anchorLayout.y + anchorLayout.height + 8,
                  right: 14,
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                  shadowColor: "#0a1929",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.18,
                  shadowRadius: 32,
                  elevation: 16,
                }}
              >
                <View className="flex-row items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 pb-3.5 pt-4">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-mc-primary">
                    <Text className="text-sm font-extrabold tracking-wide text-white">
                      {initials}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text
                      className="text-sm font-bold text-slate-900"
                      numberOfLines={1}
                    >
                      {user?.name ?? "User"}
                    </Text>
                    {user?.email && (
                      <Text
                        className="mt-0.5 text-xs text-slate-400"
                        numberOfLines={1}
                      >
                        {user.email}
                      </Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleLogout}
                  activeOpacity={0.75}
                  className="flex-row items-center gap-3 bg-white px-4 py-3.5 active:bg-red-50"
                >
                  <View className="h-8 w-8 items-center justify-center rounded-xl bg-red-50">
                    <Feather name="log-out" size={15} color="#ef4444" />
                  </View>
                  <Text className="text-sm font-semibold text-red-500">
                    Log out
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </SafeAreaView>
  );
}