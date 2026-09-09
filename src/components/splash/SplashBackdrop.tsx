import { LinearGradient } from "expo-linear-gradient";
import { View, useWindowDimensions } from "react-native";
import { SPLASH_COLORS } from "./splashTheme";

/**
 * The barangay landscape behind the splash content.
 *
 * Mayon's cone, the shoreline and a few palms, plus soft cloud shapes near the
 * top — the same scene the barangay seal carries, echoed at very low opacity so
 * it reads as texture rather than a second illustration competing with the seal.
 *
 * Built from primitives instead of a bitmap so it scales to any Android screen
 * without another asset, and it is sized from the viewport rather than fixed
 * offsets so a tall phone does not leave it stranded mid-screen.
 *
 * Entirely decorative: hidden from screen readers and non-interactive.
 */
const SplashBackdrop = () => {
  const { width, height } = useWindowDimensions();

  // The scene occupies the bottom fifth or so, scaled from the screen.
  const bandHeight = Math.max(150, height * 0.22);
  const peak = bandHeight * 0.92;

  const Cloud = ({
    top,
    left,
    scale,
  }: {
    top: number;
    left: number;
    scale: number;
  }) => (
    <View
      className="absolute"
      style={{ top, left, opacity: 0.55, transform: [{ scale }] }}
    >
      <View
        style={{
          width: 92,
          height: 34,
          borderRadius: 999,
          backgroundColor: SPLASH_COLORS.cloud,
        }}
      />
      <View
        className="absolute"
        style={{
          width: 46,
          height: 46,
          borderRadius: 999,
          left: 18,
          top: -18,
          backgroundColor: SPLASH_COLORS.cloud,
        }}
      />
      <View
        className="absolute"
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          left: 52,
          top: -10,
          backgroundColor: SPLASH_COLORS.cloud,
        }}
      />
    </View>
  );

  /** A cone, drawn as a wide rotated square clipped by the band below it. */
  const Peak = ({
    size,
    left,
    bottom,
    opacity,
  }: {
    size: number;
    left: number;
    bottom: number;
    opacity: number;
  }) => (
    <View
      className="absolute"
      style={{
        left,
        bottom,
        width: size,
        height: size,
        opacity,
        backgroundColor: SPLASH_COLORS.mountain,
        transform: [{ rotate: "45deg" }],
        borderRadius: size * 0.08,
      }}
    />
  );

  /** A palm: slim trunk with a few fronds fanned from the top. */
  const Palm = ({ left, bottom, scale }: { left: number; bottom: number; scale: number }) => (
    <View className="absolute" style={{ left, bottom, opacity: 0.5, transform: [{ scale }] }}>
      <View
        style={{
          width: 4,
          height: 54,
          borderRadius: 2,
          backgroundColor: SPLASH_COLORS.foliage,
        }}
      />
      {[-38, -14, 14, 38].map((angle) => (
        <View
          key={angle}
          className="absolute"
          style={{
            width: 30,
            height: 9,
            borderRadius: 999,
            top: -2,
            left: angle < 0 ? -26 : 2,
            backgroundColor: SPLASH_COLORS.foliage,
            transform: [{ rotate: `${angle}deg` }],
          }}
        />
      ))}
    </View>
  );

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      className="absolute inset-0"
    >
      {/* Sky wash: a single gradient rather than stacked fills, which left
          visible horizontal seams where the rectangles met. */}
      <LinearGradient
        colors={[SPLASH_COLORS.skyTop, SPLASH_COLORS.skyMid, SPLASH_COLORS.base]}
        locations={[0, 0.45, 1]}
        className="absolute left-0 right-0 top-0"
        style={{ height: height * 0.62 }}
      />

      <Cloud top={height * 0.07} left={-24} scale={1.1} />
      <Cloud top={height * 0.13} left={width - 96} scale={0.9} />

      {/* Landscape band, clipped so the cones read as mountains not diamonds. */}
      <View
        className="absolute bottom-0 left-0 right-0 overflow-hidden"
        style={{ height: bandHeight }}
      >
        <Peak size={peak} left={width * 0.52} bottom={-peak * 0.42} opacity={0.55} />
        <Peak size={peak * 0.7} left={width * 0.3} bottom={-peak * 0.32} opacity={0.38} />

        <Palm left={width * 0.06} bottom={bandHeight * 0.3} scale={1} />
        <Palm left={width * 0.17} bottom={bandHeight * 0.24} scale={0.82} />

        {/* Shoreline: two soft swells, greener toward the foreground. */}
        <View
          className="absolute left-0 right-0 overflow-hidden"
          style={{
            bottom: -bandHeight * 0.5,
            height: bandHeight,
            borderTopLeftRadius: width,
            borderTopRightRadius: width * 0.7,
            backgroundColor: SPLASH_COLORS.mountain,
            opacity: 0.5,
          }}
        />
        <View
          className="absolute left-0 right-0 overflow-hidden"
          style={{
            bottom: -bandHeight * 0.62,
            height: bandHeight * 0.9,
            borderTopLeftRadius: width * 0.8,
            borderTopRightRadius: width,
            backgroundColor: SPLASH_COLORS.foliage,
            opacity: 0.55,
          }}
        />
      </View>
    </View>
  );
};

export default SplashBackdrop;
