import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { View } from "react-native";

type ProfileHeroDecorProps = {
  /** Draw at the hero's own size so the artwork scales with the card. */
  width: number;
  height: number;
};

/**
 * The soft healthcare motif behind the hero: a pale blue hill, a leafy sprig
 * and a faint heart.
 *
 * Deliberately low-contrast and non-interactive — decoration must never compete
 * with the name and role sitting on top of it (§8).
 */
const ProfileHeroDecor = ({ width, height }: ProfileHeroDecorProps) => (
  <View
    pointerEvents="none"
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
    style={{ position: "absolute", right: 0, top: 0, bottom: 0, width, height }}
  >
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Rolling hills along the lower edge */}
      <Path
        d={`M${width * 0.32} ${height} L${width * 0.55} ${height * 0.42} L${width * 0.72} ${height} Z`}
        fill="#BFD9F5"
        opacity={0.35}
      />
      <Path
        d={`M${width * 0.58} ${height} L${width * 0.8} ${height * 0.52} L${width} ${height} Z`}
        fill="#A9CCF0"
        opacity={0.3}
      />

      {/* Faint heart, echoing the MaslogCare mark */}
      <Path
        d={`M${width * 0.86} ${height * 0.2}
            c 0 -${height * 0.06} ${width * 0.05} -${height * 0.09} ${width * 0.075} -${height * 0.03}
            c ${width * 0.025} -${height * 0.06} ${width * 0.075} -${height * 0.03} ${width * 0.075} ${height * 0.03}
            c 0 ${height * 0.08} -${width * 0.075} ${height * 0.14} -${width * 0.075} ${height * 0.14}
            s -${width * 0.075} -${height * 0.06} -${width * 0.075} -${height * 0.14} Z`}
        fill="#CFE3F8"
        opacity={0.5}
      />

      {/* Leafy sprig */}
      <Path
        d={`M${width * 0.42} ${height * 0.86} C ${width * 0.46} ${height * 0.6} ${width * 0.5} ${height * 0.44} ${width * 0.54} ${height * 0.3}`}
        stroke="#86C79A"
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
        fill="#A7DDB6"
        opacity={0.55}
        transform={`rotate(-38 ${width * 0.47} ${height * 0.58})`}
      />
      <Ellipse
        cx={width * 0.53}
        cy={height * 0.44}
        rx={width * 0.04}
        ry={height * 0.09}
        fill="#8FD3A4"
        opacity={0.5}
        transform={`rotate(28 ${width * 0.53} ${height * 0.44})`}
      />
      <Ellipse
        cx={width * 0.5}
        cy={height * 0.72}
        rx={width * 0.038}
        ry={height * 0.085}
        fill="#B7E5C4"
        opacity={0.5}
        transform={`rotate(22 ${width * 0.5} ${height * 0.72})`}
      />

      <Circle cx={width * 0.24} cy={height * 0.18} r={height * 0.05} fill="#DCEBFB" opacity={0.7} />
    </Svg>
  </View>
);

export default ProfileHeroDecor;
