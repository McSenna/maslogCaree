import { Feather } from "@expo/vector-icons";
import { Link, usePathname, useRouter } from "expo-router";
import {
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CurrentUser } from "@/contexts/AuthContext";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { getDashboardPath, getProfilePath } from "@/data/mockUsers";
import UserAvatar from "../ui/UserAvatar";

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

const Header = ({ isMobile, onPressLogin, user }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isDesktop = width >= BREAKPOINTS.desktop;
  const logoSize = isMobile ? 35 : 40;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1e2a6e" />

      <View
        style={{
          zIndex: 50,
          backgroundColor: "#3f54be",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(12,31,110,0.35)",
          boxShadow: "0px 4px 12px rgba(12,31,110,0.2)",
          elevation: 8,
          paddingTop: insets.top,
        }}
      >
        <View
          className="flex-row items-center justify-between"
          style={{
            paddingVertical: isMobile ? 10 : 12,
            paddingHorizontal: isDesktop ? 48 : isMobile ? 16 : 28,
          }}
        >
          <View
            className="flex-row items-center"
            style={{ flexShrink: 0, gap: 12 }}
          >
            <View
              style={{
                width: logoSize,
                height: logoSize,
                borderRadius: logoSize / 2,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxShadow: "0px 3px 8px rgba(0,0,0,0.18)",
                elevation: 6,
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <Image
                source={require("../../../assets/images/maslogicon.png")}
                resizeMode="contain"
                style={{
                  width: logoSize,
                  height: logoSize,
                }}
              />
            </View>

            <View>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "600",
                  fontSize: isMobile ? 15 : 18,
                  letterSpacing: 0.3,
                  lineHeight: isMobile ? 22 : 24,
                }}
              >
                MaslogCare
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.50)",
                  fontSize: 9,
                  fontWeight: "600",
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Barangay 61 Maslog
              </Text>
            </View>
          </View>

          {!isMobile && (
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
                      style={({ pressed }) => ({
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                        borderRadius: 999,
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.12)"
                          : "transparent",
                        borderWidth: 1,
                        borderColor: isActive
                          ? "rgba(255,255,255,0.15)"
                          : "transparent",
                        transform: [{ scale: pressed ? 0.96 : 1 }],
                        opacity: pressed ? 0.85 : 1,
                      })}
                    >
                      <Feather
                        name={item.icon}
                        size={13}
                        color={
                          isActive ? "#FFFFFF" : "rgba(255,255,255,0.55)"
                        }
                      />
                      <Text
                        style={{
                          fontSize: isDesktop ? 13 : 12,
                          fontWeight: isActive ? "700" : "500",
                          color: isActive
                            ? "#FFFFFF"
                            : "rgba(255,255,255,0.60)",
                        }}
                      >
                        {item.label}
                      </Text>

                      {isActive && (
                        <View
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: "#10b981",
                          }}
                        />
                      )}
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          )}

          <View
            style={{
              flexShrink: 0,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            {user ? (
              <>
                <Pressable
                  onPress={() =>
                    router.push(getProfilePath(user.role) as any)
                  }
                  style={({ pressed }) => ({
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: "rgba(255,255,255,0.4)",
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

                <Pressable
                  onPress={() =>
                    router.push(getDashboardPath(user.role) as any)
                  }
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 999,
                    paddingHorizontal: isMobile ? 14 : 18,
                    paddingVertical: isMobile ? 10 : 11,
                    backgroundColor: "#FFFFFF",
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: "#EFF6FF",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Feather name="layout" size={15} color="#2D5BFF" />
                  </View>

                  {!isMobile && (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#0C1F6E",
                      }}
                    >
                      Dashboard
                    </Text>
                  )}
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={onPressLogin}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 999,
                  paddingHorizontal: isMobile ? 14 : 18,
                  paddingVertical: isMobile ? 10 : 11,
                  backgroundColor: "#FFFFFF",
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "#EFF6FF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="user" size={15} color="#2D5BFF" />
                </View>

                <Text
                  style={{
                    fontSize: isMobile ? 13 : 14,
                    fontWeight: "700",
                    color: "rgba(255,255,255,0.50)",
                  }}
                >
                  Login
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default Header;