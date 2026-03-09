import { Feather } from "@expo/vector-icons";
import { Link, usePathname, useRouter } from "expo-router";
import { Image, Pressable, Text, View, useWindowDimensions } from "react-native";
import type { CurrentUser } from "../../contexts/AuthContext";
import { getDashboardPath } from "../../data/mockUsers";

type HeaderProps = {
  isMobile: boolean;
  onPressLogin: () => void;
  user?: CurrentUser | null;
};

const navItems = [
  { label: "Home", href: "/", icon: "home" as const },
  { label: "About", href: "/about", icon: "info" as const },
  { label: "Announcements", href: "/announcements", icon: "bell" as const },
];

export default function Header({ isMobile, onPressLogin, user }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const logoSize = isMobile ? 36 : 42;

  return (
    <View
      className="sticky top-0 z-50 bg-[#5c6dc9] border-b border-white/[0.08]"
      style={{
        shadowColor: "#0C1F6E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View
        className={`flex-row items-center justify-between py-${isMobile ? "2.5" : "3"} ${
          isDesktop ? "px-12" : isMobile ? "px-4" : "px-7"
        }`}
      >
        <View className="flex-row items-center gap-2.5">
          <View
            className="items-center justify-center overflow-hidden bg-white"
            style={{
              width: logoSize,
              height: logoSize,
              borderRadius: logoSize / 2,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              elevation: 4,
              borderWidth: 1.5,
              borderColor: "rgba(255,255,255,0.25)",
            }}
          >
            <Image
              source={require("../../assets/images/maslogicon.png")}
              style={{
                width: logoSize,
                height: logoSize,
                resizeMode: "contain",
              }}
            />
          </View>

          <View>
            <Text
              className={`font-extrabold text-white tracking-wide ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              MaslogCare
            </Text>
            <Text className="font-semibold text-white/45 text-[8.5px] tracking-[1.8px] uppercase mt-px">
              Barangay 61 Maslog
            </Text>
          </View>
        </View>

        {/* ── NAV ITEMS (tablet/desktop only) ── */}
        {!isMobile && (
          <View className="flex-1 flex-row items-center justify-center gap-1 px-4">
            {navItems.map((item, index) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/" &&
                  (pathname === "/index" || pathname === "/"));

              return (
                <Link
                  key={`${item.href}-${index}`}
                  href={item.href as any}
                  asChild
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                    className={`flex-row items-center gap-[7px] rounded-full px-3.5 py-2 border ${
                      isActive
                        ? "bg-white/[0.12] border-white/[0.15]"
                        : "bg-transparent border-transparent"
                    }`}
                    style={({ pressed }) => ({
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
                      className={`${isDesktop ? "text-[13px]" : "text-[12px]"} tracking-[0.1px] ${
                        isActive
                          ? "font-bold text-white"
                          : "font-medium text-white/60"
                      }`}
                    >
                      {item.label}
                    </Text>

                    {/* Active indicator dot */}
                    {isActive && (
                      <View className="w-1 h-1 rounded-full bg-emerald-500" />
                    )}
                  </Pressable>
                </Link>
              );
            })}
          </View>
        )}

        {/* ── CTA BUTTON ── */}
        <View>
          {user ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go to Dashboard"
              onPress={() => router.push(getDashboardPath(user.role) as any)}
              className={`flex-row items-center gap-2 rounded-full bg-white ${
                isMobile ? "px-3 py-[7px]" : "px-4 py-2"
              }`}
              style={({ pressed }) => ({
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 4,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <View className="w-[26px] h-[26px] rounded-full bg-blue-50 items-center justify-center">
                <Feather name="layout" size={14} color="#2D5BFF" />
              </View>
              {!isMobile && (
                <Text className="text-[13px] font-bold text-[#0C1F6E] tracking-[0.1px]">
                  Dashboard
                </Text>
              )}
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Login to MASLOG CARE"
              onPress={onPressLogin}
              className={`flex-row items-center gap-2 rounded-full bg-white ${
                isMobile ? "px-3 py-[7px]" : "px-4 py-2"
              }`}
              style={({ pressed }) => ({
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 4,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <View className="w-[26px] h-[26px] rounded-full bg-blue-50 items-center justify-center">
                <Feather name="user" size={14} color="#2D5BFF" />
              </View>
              <Text
                className={`${isMobile ? "text-[12px]" : "text-[13px]"} font-bold text-[#0C1F6E] tracking-[0.1px]`}
              >
                Login
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}