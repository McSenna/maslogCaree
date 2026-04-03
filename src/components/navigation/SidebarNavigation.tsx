import { Feather } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export type NavItem = {
  label: string;
  href: string;
  icon: keyof typeof Feather.glyphMap;
};

type SidebarNavigationProps = {
  items: NavItem[];
  roleLabel: string;
};

const PRIMARY = "#2A7DE1";

const SidebarNavigation = ({ items, roleLabel }: SidebarNavigationProps) => {
  const pathname = usePathname();
  const { resolvedTheme, classes } = useTheme();
  const inactiveIcon = resolvedTheme === "dark" ? "#94a3b8" : "#64748B";
  const inactiveText = resolvedTheme === "dark" ? "text-slate-400" : "text-slate-600";

  return (
    <View className={`w-56 shrink-0 border-r ${classes.sidebarBg}`}>
      <View className="sticky top-0 flex h-full flex-col p-4">
        <View className="mb-6 flex-row items-center gap-3">
          <View
            className={`items-center justify-center overflow-hidden rounded-full ${
              resolvedTheme === "dark" ? "bg-slate-800" : "bg-white shadow-sm"
            }`}
            style={{
              width: 44,
              height: 44,
              boxShadow:
                resolvedTheme === "dark"
                  ? undefined
                  : "0px 2px 4px rgba(0,0,0,0.1)",
              elevation: resolvedTheme === "dark" ? 0 : 2,
            }}
          >
            <Image
              source={require("./images/maslogicon.png")}
              resizeMode="contain"
              style={{ width: 44, height: 44 }}
            />
          </View>
          <View>
            <Text className={`text-sm font-bold ${classes.sidebarText}`}>MaslogCare</Text>
            <Text className={`text-[10px] font-medium uppercase tracking-wider ${classes.sidebarMuted}`}>
              {roleLabel}
            </Text>
          </View>
        </View>

        <View className="flex-1 gap-1">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href.endsWith("/dashboard") &&
                pathname === item.href.replace("/dashboard", "")) ||
              (item.href.endsWith("/dashboard") &&
                pathname === item.href.replace("/dashboard", "/"));

            return (
              <Link key={item.href} href={item.href as any} asChild>
                <Pressable
                  className={`flex-row items-center gap-3 rounded-xl px-3 py-2.5 ${
                    isActive
                      ? resolvedTheme === "dark"
                        ? "bg-sky-500/15"
                        : "bg-mc-primary/10"
                      : "bg-transparent"
                  }`}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Feather
                    name={item.icon}
                    size={18}
                    color={isActive ? PRIMARY : inactiveIcon}
                  />
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? "text-mc-primary" : inactiveText
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default SidebarNavigation;
