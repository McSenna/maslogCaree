import { useCallback, useEffect, useState } from "react";
import { Animated, Easing } from "react-native";
import { USE_NATIVE_DRIVER } from "@/design/motion";

const ANIMATION_OPEN_MS = 220;
const ANIMATION_CLOSE_MS = 180;

export const usePanelAnimation = (visible: boolean, onClose: () => void) => {
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
    translateY.setValue(-8);
    scale.setValue(0.96);

    Animated.parallel(
      [
        { value: opacity, toValue: 1 },
        { value: translateY, toValue: 0 },
        { value: scale, toValue: 1 },
      ].map(({ value, toValue }) =>
        Animated.timing(value, {
          toValue,
          duration: ANIMATION_OPEN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: USE_NATIVE_DRIVER,
        })
      )
    ).start();
  }, [visible, opacity, translateY, scale]);

  const animateClose = useCallback(() => {
    Animated.parallel(
      [
        { value: opacity, toValue: 0 },
        { value: translateY, toValue: -5 },
        { value: scale, toValue: 0.97 },
      ].map(({ value, toValue }) =>
        Animated.timing(value, {
          toValue,
          duration: ANIMATION_CLOSE_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: USE_NATIVE_DRIVER,
        })
      )
    ).start(() => {
      setModalVisible(false);
      onClose();
    });
  }, [opacity, translateY, scale, onClose]);

  return { opacity, translateY, scale, modalVisible, animateClose };
};
