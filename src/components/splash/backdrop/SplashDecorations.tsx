import { View } from "react-native";
import { SPLASH_COLORS } from "../splashTheme";

export const Cloud = ({ top, left, scale }: { top: number; left: number; scale: number }) => (
  <View className="absolute" style={{ top, left, opacity: 0.55, transform: [{ scale }] }}>
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

export const Peak = ({
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

export const Palm = ({ left, bottom, scale }: { left: number; bottom: number; scale: number }) => (
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
