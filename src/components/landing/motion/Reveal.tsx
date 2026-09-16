import type { ReactNode } from "react";
import { Animated, type StyleProp, type ViewStyle } from "react-native";
import { useEntrance } from "./useEntrance";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
};

const Reveal = ({ children, delay = 0, distance, style }: RevealProps) => {
  const entrance = useEntrance({ delay, distance });

  return <Animated.View style={[style, entrance]}>{children}</Animated.View>;
};

export default Reveal;
