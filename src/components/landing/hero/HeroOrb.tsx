import { View, type DimensionValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type HeroOrbProps = {
  size: number;
  colors: readonly [string, string];
  top?: DimensionValue;
  bottom?: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;
};

const HeroOrb = ({
  size,
  colors,
  top,
  bottom,
  left,
  right,
}: HeroOrbProps) => {
  return (
    <View
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
        pointerEvents: "none",
      }}
    >
      <LinearGradient
        colors={[...colors]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
};

export default HeroOrb;
