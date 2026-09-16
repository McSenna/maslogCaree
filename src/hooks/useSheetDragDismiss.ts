import { useEffect, useMemo, useRef } from "react";
import { Animated, PanResponder, useWindowDimensions } from "react-native";

const DISMISS_DISTANCE = 96;
const DISMISS_VELOCITY = 0.75;

export const useSheetDragDismiss = (visible: boolean, onClose: () => void) => {
  const { height } = useWindowDimensions();
  const dragY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) dragY.setValue(0);
  }, [visible, dragY]);

  const dismiss = useRef(onClose);
  dismiss.current = onClose;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          gesture.dy > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderMove: (_event, gesture) => {
          if (gesture.dy > 0) dragY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_event, gesture) => {
          const shouldDismiss = gesture.dy > DISMISS_DISTANCE || gesture.vy > DISMISS_VELOCITY;

          if (shouldDismiss) {
            Animated.timing(dragY, {
              toValue: height,
              duration: 180,
              useNativeDriver: true,
            }).start(() => dismiss.current());
            return;
          }

          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
            speed: 18,
          }).start();
        },
      }),
    [dragY, height]
  );

  return { dragY, panResponder, height };
};
