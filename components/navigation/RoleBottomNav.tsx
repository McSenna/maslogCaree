import { Feather } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import type { NavItem } from "./SidebarNavigation";

type RoleBottomNavProps = {
  items: NavItem[];
};

const RoleBottomNav = ({ items }: RoleBottomNavProps) => {
  const pathname = usePathname();

  function NavItem({
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

    const bgColor = activeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(45, 91, 255, 0)", "rgba(45, 91, 255, 0.10)"],
    });

    const labelColor = activeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#94a3b8", "#2D5BFF"],
    });

    const iconColor = isActive ? "#2D5BFF" : "#94a3b8";

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
                gap: 3,
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 16,
                backgroundColor: bgColor,
              }}
            >
              <Feather name={item.icon} size={18} color={iconColor} />
              <Animated.Text
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  letterSpacing: 0.2,
                  color: labelColor,
                }}
              >
                {item.label}
              </Animated.Text>
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
          backgroundColor: "#F8F8FA",
          paddingHorizontal: 8,
          paddingVertical: 6,
          shadowColor: "#2D5BFF",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 8,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.9)",
        }}
      >
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavItem key={item.href} item={item} isActive={isActive} />
          );
        })}
      </View>
    </View>
  );
}

export default RoleBottomNav