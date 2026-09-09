import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { SidebarPalette } from "./sidebarTheme";

const WIDTH = 288;
const HEIGHT = 130;

/**
 * The pale wave band along the very bottom of the sidebar.
 *
 * Kept at a whisper on purpose. The seal and its tagline sit above it, and the
 * moment the waves are legible in their own right they start competing with the
 * mark they are meant to settle. Decorative only, and hidden from assistive
 * technology.
 */
export default function SidebarDecorations({ palette }: { palette: SidebarPalette }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: HEIGHT,
        pointerEvents: "none",
      }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMax slice"
      >
        <Path
          d={`M0 54c48-22 92 12 142 4s102-30 146-8v${HEIGHT}H0Z`}
          fill={palette.waveSoft}
          opacity={0.85}
        />
        <Path
          d={`M0 82c56-18 90 12 140 6s98-24 148-6v${HEIGHT}H0Z`}
          fill={palette.wave}
          opacity={0.6}
        />
        <Path
          d={`M0 104c60-14 96 10 148 4s92-16 140-2v${HEIGHT}H0Z`}
          fill={palette.waveSoft}
          opacity={0.95}
        />
      </Svg>
    </View>
  );
}
