import { useEffect, useRef } from "react";
import { Animated, PanResponder } from "react-native";
import { USE_NATIVE_DRIVER } from "@/design/motion";

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
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const animateOutRef = useRef(animateOut);
  useEffect(() => {
    animateOutRef.current = animateOut;
  }, [animateOut]);

  return useRef(
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
  ).current;
};
