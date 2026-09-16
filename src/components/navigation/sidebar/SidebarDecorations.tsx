import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { SidebarPalette } from "./sidebarTheme";

const WIDTH = 288;
const HEIGHT = 150;

const SidebarDecorations = ({ palette }: { palette: SidebarPalette }) => {
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
          d={`M0 108 L54 66 L96 96 L150 44 L214 100 L288 62 V${HEIGHT} H0 Z`}
          fill={palette.waveSoft}
          opacity={0.9}
        />
        <Path
          d={`M0 ${HEIGHT} L44 104 L92 128 L140 72 L196 122 L246 96 L288 124 V${HEIGHT} Z`}
          fill={palette.wave}
          opacity={0.55}
        />
        <Path d="M126 88 L140 72 L154 88 L140 82 Z" fill={palette.surface} opacity={0.75} />
      </Svg>
    </View>
  );
};

export default SidebarDecorations;
