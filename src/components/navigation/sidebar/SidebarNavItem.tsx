import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text } from "react-native";
import { SIDEBAR_METRICS, type SidebarPalette } from "./sidebarTheme";

/** `aria-current` has no React Native equivalent; web only. */
const currentPageProps = Platform.OS === "web" ? ({ "aria-current": "page" } as object) : {};

type SidebarNavItemProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  href: string;
  isActive: boolean;
  palette: SidebarPalette;
};

/**
 * One destination in the sidebar.
 *
 * The whole row is the target, not the label — a 52px pill is what makes the
 * nav comfortable to hit without aiming. Selection is drawn as a filled pill
 * rather than a left marker so it reads at a glance from across the desk, and
 * carries `aria-current` so it reads the same to a screen reader.
 */
export default function SidebarNavItem({
  label,
  icon,
  href,
  isActive,
  palette,
}: SidebarNavItemProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const background = isActive
    ? palette.activeBg
    : hovered
      ? palette.hoverBg
      : "transparent";
  const foreground = isActive ? palette.active : palette.idle;

  return (
    <Link href={href as never} asChild>
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
        // A plain object, never the function form: react-native-web drops a
        // function `style` on Pressable, which silently loses the row's height
        // and turns the nav into a cramped list. Press state rides on its own
        // flag instead.
        style={{
          height: SIDEBAR_METRICS.itemHeight,
          paddingHorizontal: SIDEBAR_METRICS.itemPaddingX,
          borderRadius: SIDEBAR_METRICS.itemRadius,
          backgroundColor: background,
          opacity: pressed ? 0.85 : 1,
          // Colour and background only — a nav that moves under the cursor
          // makes the sidebar feel unsteady.
          transitionDuration: "160ms",
          transitionProperty: "background-color",
        }}
      >
        <Feather name={icon} size={SIDEBAR_METRICS.iconSize} color={foreground} />
        {/* The label leads and the icon supports, so it takes the larger size
            and the heavier weight when selected. */}
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
}
