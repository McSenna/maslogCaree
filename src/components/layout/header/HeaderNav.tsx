import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "home" as const },
  { label: "About", href: "/about", icon: "info" as const },
  { label: "Announcements", href: "/announcements", icon: "bell" as const },
];

type Props = { pathname: string; isDesktop: boolean };

const HeaderNav = ({ pathname, isDesktop }: Props) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingHorizontal: 16,
      }}
    >
      {NAV_ITEMS.map((item, index) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/" && (pathname === "/index" || pathname === "/"));

        return (
          <Link key={`${item.href}-${index}`} href={item.href as any} asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                borderRadius: 999,
                paddingHorizontal: 14,
                paddingVertical: 8,
                backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                borderWidth: 1,
                borderColor: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                transform: [{ scale: pressed ? 0.96 : 1 }],
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Feather
                name={item.icon}
                size={13}
                color={isActive ? "#FFFFFF" : "rgba(255,255,255,0.55)"}
              />
              <Text
                style={{
                  fontSize: isDesktop ? 13 : 12,
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.60)",
                }}
              >
                {item.label}
              </Text>

              {isActive && (
                <View
                  style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: "#10b981" }}
                />
              )}
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
};

export default HeaderNav;
