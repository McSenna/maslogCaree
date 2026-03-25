import { Feather } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export type NavItem = {
  label: string;
  href: string;
  icon: keyof typeof Feather.glyphMap;
};

type SidebarNavigationProps = {
  items: NavItem[];
  roleLabel: string;
};

const SidebarNavigation = ({ items, roleLabel }: SidebarNavigationProps) => {
  const pathname = usePathname();

  return (
    <View className="w-56 shrink-0 border-r border-slate-200 bg-white">
      <View className="sticky top-0 flex h-full flex-col p-4">
        <View className="mb-6 flex-row items-center gap-3">
          <View
            className="items-center justify-center overflow-hidden rounded-full bg-white shadow-sm"
            style={{
              width: 44,
              height: 44,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Image
              source={require("./images/maslogicon.png")}
              style={{ width: 44, height: 44, resizeMode: "contain" }}
            />
          </View>
          <View>
            <Text className="text-sm font-bold text-slate-900">MaslogCare</Text>
            <Text className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              {roleLabel}
            </Text>
          </View>
        </View>

        <View className="flex-1 gap-1">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href.endsWith("/dashboard") && pathname === item.href.replace("/dashboard", "")) ||
              (item.href.endsWith("/dashboard") && pathname === item.href.replace("/dashboard", "/"));

            return (
              <Link key={item.href} href={item.href as any} asChild>
                <Pressable
                  className={`flex-row items-center gap-3 rounded-xl px-3 py-2.5 ${
                    isActive ? "bg-mc-primary/10" : "bg-transparent"
                  }`}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Feather
                    name={item.icon}
                    size={18}
                    color={isActive ? "#2D5BFF" : "#64748B"}
                  />
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? "text-mc-primary" : "text-slate-600"
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
}

export default SidebarNavigation