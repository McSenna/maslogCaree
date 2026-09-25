import { Link, type Href } from "expo-router";
import { View } from "react-native";
import NavItemLink from "./NavItemLink";

export const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "About", href: "/about", icon: "info" },
  { label: "Announcements", href: "/announcements", icon: "bell" },
] as const satisfies readonly { label: string; href: Href; icon: string }[];

type Props = { pathname: string; isDesktop: boolean };

const HeaderNav = ({ pathname, isDesktop }: Props) => {
  return (
    <View
      accessibilityRole="menubar"
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
          <Link key={`${item.href}-${index}`} href={item.href} asChild>
            <NavItemLink
              label={item.label}
              icon={item.icon}
              isActive={isActive}
              isDesktop={isDesktop}
            />
          </Link>
        );
      })}
    </View>
  );
};

export default HeaderNav;
