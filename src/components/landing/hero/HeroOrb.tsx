import { Animated, type DimensionValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFloat } from "../motion/useFloat";

type HeroOrbProps = {
  size: number;
  colors: readonly [string, string];
  top?: DimensionValue;
  bottom?: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;
  distance?: number;
  duration?: number;
  delay?: number;
};

const HeroOrb = ({
  size,
  colors,
  top,
  bottom,
  left,
  right,
  distance = 12,
  duration = 6200,
  delay = 0,
}: HeroOrbProps) => {
  const translateY = useFloat({ distance, duration, delay });

  return (
    <Animated.View
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        transform: [{ translateY }],
        pointerEvents: "none",
      }}
    >
      <LinearGradient
        colors={[...colors]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ width: "100%", height: "100%" }}
      />
    </Animated.View>
  );
};

export default HeroOrb;
