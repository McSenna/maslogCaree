import { Text, View } from "react-native";
import { SIDEBAR_METRICS, type SidebarPalette } from "./sidebarTheme";

/**
 * Whose workspace the navigation below belongs to.
 *
 * A section label rather than a title: the branding above already says what
 * the system is, so this only has to say which role's menu follows. Comes from
 * the signed-in user, never a constant — the same sidebar serves all five.
 */
export default function SidebarHeader({
  roleLabel,
  palette,
}: {
  roleLabel: string;
  palette: SidebarPalette;
}) {
  return (
    <View style={{ paddingHorizontal: SIDEBAR_METRICS.itemPaddingX }}>
      <Text
        accessibilityRole="header"
        className="text-[11.5px] font-semibold uppercase"
        style={{ color: palette.eyebrow, letterSpacing: 2 }}
      >
        {roleLabel}
      </Text>
    </View>
  );
}
