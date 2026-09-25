import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, { FadeIn, FadeOutLeft, LinearTransition } from "react-native-reanimated";
import { TIMING } from "@/theme/motion";

type AnimatedListItemProps = {
  children: ReactNode;
  index?: number;
  style?: StyleProp<ViewStyle>;
};

const STAGGER_MS = 30;
const MAX_STAGGERED = 6;

const AnimatedListItem = ({ children, index = 0, style }: AnimatedListItemProps) => (
  <Animated.View
    style={style}
    entering={FadeIn.duration(TIMING.enter).delay(Math.min(index, MAX_STAGGERED) * STAGGER_MS)}
    exiting={FadeOutLeft.duration(TIMING.exit)}
    layout={LinearTransition.duration(TIMING.enter)}
  >
    {children}
  </Animated.View>
);

export default AnimatedListItem;
