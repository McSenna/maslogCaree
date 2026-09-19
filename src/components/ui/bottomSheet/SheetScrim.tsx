import { Animated, Pressable } from "react-native";

type SheetScrimProps = {
  color: string;
  opacity: Animated.Value | number;
  onPress: () => void;
};

const SheetScrim = ({ color, opacity, onPress }: SheetScrimProps) => (
  <Animated.View
    style={{
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: color,
      opacity,
    }}
  >
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close"
      onPress={onPress}
      style={{ flex: 1 }}
    />
  </Animated.View>
);

export default SheetScrim;
