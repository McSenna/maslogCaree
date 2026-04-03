import { Feather } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { NavItem } from "./SidebarNavigation";

type RoleBottomNavProps = {
  items: NavItem[];
};

const PRIMARY = "#2A7DE1";

const RoleBottomNav = ({ items }: RoleBottomNavProps) => {
  const pathname = usePathname();
  const { classes, resolvedTheme } = useTheme();
  const inactiveIcon = resolvedTheme === "dark" ? "#94a3b8" : "#94a3b8";

  function NavItemButton({
    item,
    isActive,
  }: {
    item: NavItem;
    isActive: boolean;
  }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const activeAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

    useEffect(() => {
      Animated.spring(activeAnim, {
        toValue: isActive ? 1 : 0,
        useNativeDriver: false,
        tension: 120,
        friction: 10,
      }).start();
    }, [isActive, activeAnim]);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.88,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }).start();
    };

    const activeRgb =
      resolvedTheme === "dark" ? "56, 189, 248" : "45, 91, 255";
    const bgColor = activeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [`rgba(${activeRgb}, 0)`, `rgba(${activeRgb}, 0.14)`],
    });

    const iconColor = isActive ? PRIMARY : inactiveIcon;

    return (
      <Link href={item.href as any} asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={item.label}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{ flex: 1, alignItems: "center" }}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Animated.View
              style={{
                alignItems: "center",
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 18,
                backgroundColor: bgColor,
              }}
            >
              <Feather name={item.icon} size={20} color={iconColor} />
            </Animated.View>
          </Animated.View>
        </Pressable>
      </Link>
    );
  }

  return (
    <View
      style={{
        position: "absolute",
        bottom: 8,
        left: 0,
        right: 0,
        zIndex: 50,
        alignItems: "center",
        pointerEvents: "box-none",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 24,
          borderRadius: 26,
          backgroundColor: classes.bottomNavBg,
          paddingHorizontal: 8,
          paddingVertical: 6,
          boxShadow:
            resolvedTheme === "dark"
              ? "0px 4px 20px rgba(0,0,0,0.45)"
              : "0px 4px 16px rgba(45,91,255,0.1)",
          elevation: 8,
          borderWidth: 1,
          borderColor: classes.bottomNavBorder,
        }}
      >
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavItemButton key={item.href} item={item} isActive={isActive} />
          );
        })}
      </View>
    </View>
  );
};

export default RoleBottomNav;
