import { useCallback, useEffect, useState } from "react";
import { Animated } from "react-native";
import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";

const ANIMATION_OPEN_MS = TIMING.enter;
const ANIMATION_CLOSE_MS = TIMING.exit - 30;

export const usePanelAnimation = (visible: boolean, onClose: () => void) => {
  const reducedMotion = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(-8));
  const [scale] = useState(() => new Animated.Value(0.96));

  const [modalVisible, setModalVisible] = useState(false);

  if (visible && !modalVisible) {
    setModalVisible(true);
  }

  useEffect(() => {
    if (!visible) return;

    opacity.setValue(0);
    translateY.setValue(reducedMotion ? 0 : -8);
    scale.setValue(reducedMotion ? 1 : 0.96);

    Animated.parallel(
      [
        { value: opacity, toValue: 1 },
        { value: translateY, toValue: 0 },
        { value: scale, toValue: 1 },
      ].map(({ value, toValue }) =>
        Animated.timing(value, {
          toValue,
          duration: ANIMATION_OPEN_MS,
          easing: EASING.out,
          useNativeDriver: USE_NATIVE_DRIVER,
        })
      )
    ).start();
  }, [visible, reducedMotion, opacity, translateY, scale]);

  const animateClose = useCallback(() => {
    Animated.parallel(
      [
        { value: opacity, toValue: 0 },
        { value: translateY, toValue: reducedMotion ? 0 : -4 },
        { value: scale, toValue: reducedMotion ? 1 : 0.98 },
      ].map(({ value, toValue }) =>
        Animated.timing(value, {
          toValue,
          duration: ANIMATION_CLOSE_MS,
          easing: EASING.out,
          useNativeDriver: USE_NATIVE_DRIVER,
        })
      )
    ).start(() => {
      setModalVisible(false);
      onClose();
    });
  }, [reducedMotion, opacity, translateY, scale, onClose]);

  return { opacity, translateY, scale, modalVisible, animateClose };
};
