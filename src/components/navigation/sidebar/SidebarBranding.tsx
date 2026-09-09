import { Image, Text, View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";
import { SIDEBAR_METRICS, type SidebarPalette } from "./sidebarTheme";

/**
 * The official Barangay 61 Maslog seal.
 *
 * The real artwork, loaded from the app's own assets and never redrawn — a
 * government seal is a mark of authority, and an approximation of one is worse
 * than none. `contain` on a square box so it can never be stretched out of
 * round by a change to the sidebar's width.
 */
const BARANGAY_SEAL = require("../../../../assets/images/maslogicon.png");

/**
 * The decorated area around the seal: orbit, leaves and sparkles.
 *
 * Sized to the artwork rather than left generous — slack inside this box reads
 * as a gap between the seal and its tagline, which pulls the two apart into
 * separate things instead of one mark.
 */
const FRAME = 132;

/** One leaf, drawn pointing up from its stem so it can simply be rotated. */
const LEAF_PATH = "M0 0 c-7 -8 -7 -19 0 -27 c7 8 7 19 0 27 Z";

/**
 * The frame around the seal.
 *
 * Everything here sits behind or beside the seal and never on it — the orbit
 * clears its edge, the leaves sit low and wide, the sparkles keep to the upper
 * corners. The point is to make the lower sidebar feel composed rather than
 * merely occupied, without touching the official mark itself.
 */
function SealFrame({ palette }: { palette: SidebarPalette }) {
  const c = FRAME / 2;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ position: "absolute", width: FRAME, height: FRAME, pointerEvents: "none" }}
    >
      <Svg width={FRAME} height={FRAME} viewBox={`0 0 ${FRAME} ${FRAME}`}>
        {/* Orbit — two arcs rather than a closed ring, so it reads as a light
            frame instead of a second border around the seal. */}
        <Path
          d={`M ${c - 52} ${c - 18} A 52 52 0 0 1 ${c + 24} ${c - 46}`}
          stroke={palette.decorLine}
          strokeWidth={1.4}
          strokeLinecap="round"
          fill="none"
          opacity={0.75}
        />
        <Path
          d={`M ${c + 52} ${c + 11} A 52 52 0 0 1 ${c - 22} ${c + 47}`}
          stroke={palette.decorLine}
          strokeWidth={1.4}
          strokeLinecap="round"
          fill="none"
          opacity={0.55}
        />
        <Circle cx={c + 24} cy={c - 46} r={2.4} fill={palette.decorLine} opacity={0.9} />

        {/* A small sprig either side of the seal's base — two leaves each,
            angled outward and away, so they frame the mark rather than crowd
            it. Mirrored rather than drawn twice. */}
        {[-1, 1].map((side) => (
          <G key={`sprig-${side}`}>
            <Path
              d={LEAF_PATH}
              fill={palette.decorSoft}
              opacity={0.9}
              transform={`translate(${c + side * 52} ${c + 42}) rotate(${side * 52})`}
            />
            <Path
              d={LEAF_PATH}
              fill={palette.decorSoft}
              opacity={0.6}
              transform={`translate(${c + side * 42} ${c + 51}) rotate(${side * 88}) scale(0.82)`}
            />
          </G>
        ))}

        {/* Two four-point sparkles, upper corners only. */}
        {[
          { x: c - 50, y: c - 36, s: 5.5 },
          { x: c + 48, y: c - 24, s: 4.5 },
        ].map((star, i) => (
          <Path
            key={`sparkle-${i}`}
            d={`M ${star.x} ${star.y - star.s} Q ${star.x} ${star.y} ${star.x + star.s} ${star.y} Q ${star.x} ${star.y} ${star.x} ${star.y + star.s} Q ${star.x} ${star.y} ${star.x - star.s} ${star.y} Q ${star.x} ${star.y} ${star.x} ${star.y - star.s} Z`}
            fill={palette.decorLine}
            opacity={0.65}
          />
        ))}
      </Svg>
    </View>
  );
}

/** `──── ♡ ────`, the quiet full stop under the tagline. */
function HeartRule({ palette }: { palette: SidebarPalette }) {
  const rule = (
    <View style={{ height: 1, width: 34, backgroundColor: palette.decorLine, opacity: 0.9 }} />
  );

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="mt-2.5 flex-row items-center justify-center"
      style={{ gap: 10 }}
    >
      {rule}
      <Svg width={13} height={12} viewBox="0 0 13 12">
        <Path
          d="M6.5 11S1 7.6 1 4.2A2.9 2.9 0 0 1 6.5 2.6 2.9 2.9 0 0 1 12 4.2C12 7.6 6.5 11 6.5 11Z"
          stroke={palette.active}
          strokeWidth={1.2}
          fill="none"
          strokeLinejoin="round"
        />
      </Svg>
      {rule}
    </View>
  );
}

/**
 * Whose health centre this is, at the foot of the sidebar.
 *
 * The barangay's own seal, centred and framed — the product name is already in
 * the app header, so repeating it here would spend the quietest part of the
 * sidebar on branding the reader has seen. What belongs here is the community
 * the workspace serves.
 */
export default function SidebarBranding({ palette }: { palette: SidebarPalette }) {
  return (
    <View className="w-full items-center">
      <View
        className="items-center justify-center"
        style={{ width: FRAME, height: FRAME }}
      >
        <SealFrame palette={palette} />
        <Image
          source={BARANGAY_SEAL}
          accessibilityLabel="Barangay 61 Maslog, Legazpi City seal"
          resizeMode="contain"
          style={{
            width: SIDEBAR_METRICS.sealSize,
            height: SIDEBAR_METRICS.sealSize,
            flexShrink: 0,
          }}
        />
      </View>

      <Text
        className="mt-1 text-[10px] font-semibold uppercase"
        style={{ color: palette.community, letterSpacing: 2.1 }}
      >
        Serving the Community
      </Text>

      <HeartRule palette={palette} />
    </View>
  );
}
