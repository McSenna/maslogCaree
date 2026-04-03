import { Link, usePathname } from "expo-router";
import { useRef } from "react";
import { Animated, Pressable, View, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BREAKPOINTS } from "@/constants/breakpoints";

export default function BottomNav() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.desktop;

  const bottomPad = Math.max(insets.bottom, 8);

  const navItems: {
    label: string;
    href: string;
    icon: keyof typeof Feather.glyphMap;
  }[] = [
    { label: "Home", href: "/", icon: "home" },
    { label: "About", href: "/about", icon: "info" },
    { label: "Announcements", href: "/announcements", icon: "bell" },
  ];

  function NavItem({
    item,
    isActive,
  }: {
    item: (typeof navItems)[0];
    isActive: boolean;
  }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.88,
        useNativeDriver: true,
        tension: 220,
        friction: 12,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 220,
        friction: 12,
      }).start();
    };

    const ACTIVE_COLOR = "#2D5BFF";
    const INACTIVE_COLOR = "#9BAEC8";

    const iconColor = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;
    const labelColor = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;
    const bgColor = isActive ? "rgba(45,91,255,0.08)" : "transparent";

    return (
      <Link href={item.href as any} replace asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={item.label}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{ flex: 1, alignItems: "center" }}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View
              style={{
                alignItems: "center",
                gap: isTablet ? 5 : 3,
                paddingHorizontal: isTablet ? 20 : 12,
                paddingVertical: isTablet ? 10 : 8,
                borderRadius: 18,
                backgroundColor: bgColor,
              }}
            >
              {isActive && (
                <View
                  style={{
                    position: "absolute",
                    top: 6,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: ACTIVE_COLOR,
                    right: 8,
                    opacity: 0.6,
                  }}
                />
              )}
              <Feather
                name={item.icon}
                size={isTablet ? 20 : 18}
                color={iconColor}
              />
              <Animated.Text
                style={{
                  fontSize: isTablet ? 11 : 10,
                  fontWeight: "700",
                  letterSpacing: 0.1,
                  color: labelColor,
                }}
              >
                {item.label}
              </Animated.Text>
            </View>
          </Animated.View>
        </Pressable>
      </Link>
    );
  }

  const navWidth = isDesktop ? 420 : isTablet ? 360 : undefined;

  const BAR_MIN_HEIGHT = 56;

  return (
    <View
      className="absolute left-0 right-0 items-center"
      style={{
        zIndex: 50,
        bottom: 0,
        paddingBottom: bottomPad,
        paddingHorizontal: isDesktop ? 24 : 16,
        pointerEvents: "box-none",
      }}
    >
      <View
        className="flex-row items-center rounded-3xl border border-slate-200/80 bg-white px-2 py-1.5"
        style={{
          width: navWidth,
          marginHorizontal: navWidth ? undefined : 0,
          minHeight: BAR_MIN_HEIGHT,
          boxShadow: "0px 6px 20px rgba(12,31,110,0.12)",
          elevation: 10,
        }}
      >
        {navItems.map((item, index) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/" && (pathname === "/index" || pathname === "/"));

          return (
            <NavItem
              key={`${item.href}-${index}`}
              item={item}
              isActive={isActive}
            />
          );
        })}
      </View>
    </View>
  );
}