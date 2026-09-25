import { Animated } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

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
  const colors = useThemeColors();
  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: colors.skeleton,
        opacity,
      }}
    />
  );
};

export default Block;
