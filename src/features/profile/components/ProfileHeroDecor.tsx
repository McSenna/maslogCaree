import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { View } from "react-native";
import { PALETTE } from "@/theme/palette";

type ProfileHeroDecorProps = {
  width: number;
  height: number;
};

const ProfileHeroDecor = ({ width, height }: ProfileHeroDecorProps) => (
  <View
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
    style={{
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width,
      height,
      pointerEvents: "none",
    }}
  >
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Path
        d={`M${width * 0.32} ${height} L${width * 0.55} ${height * 0.42} L${width * 0.72} ${height} Z`}
        fill={PALETTE.slate[300]}
        opacity={0.35}
      />
      <Path
        d={`M${width * 0.58} ${height} L${width * 0.8} ${height * 0.52} L${width} ${height} Z`}
        fill={PALETTE.slate[300]}
        opacity={0.3}
      />

      <Path
        d={`M${width * 0.86} ${height * 0.2}
            c 0 -${height * 0.06} ${width * 0.05} -${height * 0.09} ${width * 0.075} -${height * 0.03}
            c ${width * 0.025} -${height * 0.06} ${width * 0.075} -${height * 0.03} ${width * 0.075} ${height * 0.03}
            c 0 ${height * 0.08} -${width * 0.075} ${height * 0.14} -${width * 0.075} ${height * 0.14}
            s -${width * 0.075} -${height * 0.06} -${width * 0.075} -${height * 0.14} Z`}
        fill={PALETTE.blue[200]}
        opacity={0.5}
      />

      <Path
        d={`M${width * 0.42} ${height * 0.86} C ${width * 0.46} ${height * 0.6} ${width * 0.5} ${height * 0.44} ${width * 0.54} ${height * 0.3}`}
        stroke={PALETTE.success[300]}
        strokeWidth={1.6}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />
      <Ellipse
        cx={width * 0.47}
        cy={height * 0.58}
        rx={width * 0.045}
        ry={height * 0.1}
        fill={PALETTE.success[200]}
        opacity={0.55}
        transform={`rotate(-38 ${width * 0.47} ${height * 0.58})`}
      />
      <Ellipse
        cx={width * 0.53}
        cy={height * 0.44}
        rx={width * 0.04}
        ry={height * 0.09}
        fill={PALETTE.success[300]}
        opacity={0.5}
        transform={`rotate(28 ${width * 0.53} ${height * 0.44})`}
      />
      <Ellipse
        cx={width * 0.5}
        cy={height * 0.72}
        rx={width * 0.038}
        ry={height * 0.085}
        fill={PALETTE.success[200]}
        opacity={0.5}
        transform={`rotate(22 ${width * 0.5} ${height * 0.72})`}
      />

      <Circle cx={width * 0.24} cy={height * 0.18} r={height * 0.05} fill={PALETTE.blue[100]} opacity={0.7} />
    </Svg>
  </View>
);

export default ProfileHeroDecor;
