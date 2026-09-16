import { Text, View } from "react-native";
import { SIDEBAR_METRICS, type SidebarPalette } from "./sidebarTheme";

const SidebarHeader = ({
  roleLabel,
  palette,
}: {
  roleLabel: string;
  palette: SidebarPalette;
}) => {
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
};

export default SidebarHeader;
