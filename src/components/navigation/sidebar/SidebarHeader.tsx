import { Text, View } from "react-native";
import { SIDEBAR_METRICS, type SidebarPalette } from "./sidebarTheme";

/**
 * Whose workspace this is.
 *
 * The role is the small line and "Workspace" is the large one, rather than the
 * reverse: a signed-in doctor already knows they are a doctor, so the role is
 * the qualifier and the workspace is the place. Left-aligned with the nav below
 * it, so the eye runs down a single edge.
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
        className="text-[11.5px] font-semibold uppercase"
        style={{ color: palette.eyebrow, letterSpacing: 2.2 }}
      >
        {roleLabel}
      </Text>
      <Text
        accessibilityRole="header"
        className="mt-1 text-[25px] font-bold"
        style={{ color: palette.heading, letterSpacing: -0.4 }}
      >
        Workspace
      </Text>
    </View>
  );
}
