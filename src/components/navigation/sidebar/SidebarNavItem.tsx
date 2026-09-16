import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useNavLinkPress } from "../useNavLinkPress";
import { useState } from "react";
import { Platform, Pressable, Text } from "react-native";
import { SIDEBAR_METRICS, type SidebarPalette } from "./sidebarTheme";

const currentPageProps = Platform.OS === "web" ? ({ "aria-current": "page" } as object) : {};

type SidebarNavItemProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  href: string;
  isActive: boolean;
  palette: SidebarPalette;
};

const SidebarNavItem = ({
  label,
  icon,
  href,
  isActive,
  palette,
}: SidebarNavItemProps) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const background = isActive
    ? palette.activeBg
    : hovered
      ? palette.hoverBg
      : "transparent";
  const foreground = isActive ? palette.active : palette.idle;

  const handlePress = useNavLinkPress(href);

  return (
    <Link href={href as never} asChild onPress={handlePress}>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={label}
        accessibilityState={{ selected: isActive }}
        {...(isActive ? currentPageProps : {})}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        className="w-full flex-row items-center"
        style={{
          height: SIDEBAR_METRICS.itemHeight,
          paddingHorizontal: SIDEBAR_METRICS.itemPaddingX,
          borderRadius: SIDEBAR_METRICS.itemRadius,
          backgroundColor: background,
          opacity: pressed ? 0.85 : 1,
          transitionDuration: "160ms",
          transitionProperty: "background-color",
        }}
      >
        <Feather name={icon} size={SIDEBAR_METRICS.iconSize} color={foreground} />
        <Text
          numberOfLines={1}
          className={`min-w-0 flex-1 text-[16px] ${isActive ? "font-semibold" : "font-normal"}`}
          style={{ color: foreground, marginLeft: SIDEBAR_METRICS.iconGap }}
        >
          {label}
        </Text>
      </Pressable>
    </Link>
  );
};

export default SidebarNavItem;
