import { View, type DimensionValue } from "react-native";

type HeroOrbProps = {
  size: number;
  /** A single faint solid tint. */
  color: string;
  top?: DimensionValue;
  bottom?: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;
};

const HeroOrb = ({
  size,
  color,
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
        backgroundColor: color,
        pointerEvents: "none",
      }}
    />
  );
};

export default HeroOrb;
