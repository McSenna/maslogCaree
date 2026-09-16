import { Animated } from "react-native";

const Block = ({
  width,
  height,
  radius = 8,
  opacity,
}: {
  width: number | `${number}%`;
  height: number;
  radius?: number;
  opacity: Animated.Value;
}) => {
  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: "#E7EDF5",
        opacity,
      }}
    />
  );
};

export default Block;
