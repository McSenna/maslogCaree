import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { SIDEBAR_METRICS, type SidebarPalette } from "./sidebarTheme";

/** A single leaf — the one green note in an otherwise blue rail. */
function Leaf({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 17 17" accessibilityElementsHidden>
      <Path
        d="M14.5 2.2C8.9 1.6 3.6 3.7 2.6 8.2c-.7 3.1 1 5.6 3.3 6.4 1-3.9 3.4-6.6 6.6-8.2-2.6 2-4.4 4.7-5.2 8.4 4.6.6 7.6-2.6 7.9-7 .1-2-.3-4-.7-5.6Z"
        fill={color}
      />
    </Svg>
  );
}

/**
 * The closing note at the foot of the rail.
 *
 * Deliberately a sentiment rather than a control: this is the quietest part of
 * the sidebar and anything actionable placed here would be hunted for. It says
 * who the work is for, and nothing else.
 */
export default function SidebarBranding({ palette }: { palette: SidebarPalette }) {
  return (
    <View
      className="w-full flex-row items-center gap-2.5"
      style={{ paddingHorizontal: SIDEBAR_METRICS.itemPaddingX }}
    >
      <Leaf color={palette.leaf} />
      <Text
        className="min-w-0 flex-1 text-[13px] font-medium"
        style={{ color: palette.community, lineHeight: 18 }}
      >
        Caring for a{"\n"}Healthier Community
      </Text>
    </View>
  );
}
