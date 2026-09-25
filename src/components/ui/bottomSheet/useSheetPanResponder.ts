import { useState } from "react";
import { Animated, PanResponder } from "react-native";
import { USE_NATIVE_DRIVER } from "@/theme/motion";
import { useLatestRef } from "@/hooks/useLatestRef";

const DISMISS_DISTANCE = 110;
const DISMISS_VELOCITY = 0.75;

const springBack = (translateY: Animated.Value) =>
  Animated.spring(translateY, {
    toValue: 0,
    useNativeDriver: USE_NATIVE_DRIVER,
    bounciness: 0,
    speed: 14,
  }).start();

export const useSheetPanResponder = ({
  translateY,
  animateOut,
  onClose,
}: {
  translateY: Animated.Value;
  animateOut: (then: () => void) => void;
  onClose: () => void;
}) => {
  const onCloseRef = useLatestRef(onClose);
  const animateOutRef = useLatestRef(animateOut);

  // Created once. The refs are read only inside gesture callbacks, never during render.
  // eslint-disable-next-line react-hooks/refs
  const [panResponder] = useState(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_event, gesture) =>
        gesture.dy > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),

      onPanResponderMove: (_event, gesture) => {
        translateY.setValue(Math.max(0, gesture.dy));
      },

      onPanResponderRelease: (_event, gesture) => {
        const dismiss = gesture.dy > DISMISS_DISTANCE || gesture.vy > DISMISS_VELOCITY;

        if (dismiss) {
          animateOutRef.current(onCloseRef.current);
          return;
        }

        springBack(translateY);
      },

      onPanResponderTerminate: () => springBack(translateY),
    })
  );

  return panResponder;
};
