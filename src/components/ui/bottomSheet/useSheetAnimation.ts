import { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, Platform } from "react-native";

import { DURATION, useReducedMotion } from "@/design/motion";

const OPEN_MS = DURATION.screen;
const CLOSE_MS = DURATION.exit;

export const useSheetAnimation = ({
  visible,
  isSheet,
  height,
  onClose,
}: {
  visible: boolean;
  isSheet: boolean;
  height: number;
  onClose: () => void;
}) => {
  const reducedMotion = useReducedMotion();

  const translateY = useRef(new Animated.Value(height)).current;
  const scrimOpacity = useRef(new Animated.Value(0)).current;
  const sheetHeight = useRef(height);
  const opened = useRef(false);

  const animateOut = useCallback(
    (then: () => void) => {
      if (reducedMotion) {
        translateY.setValue(sheetHeight.current);
        scrimOpacity.setValue(0);
        then();
        return;
      }

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: sheetHeight.current,
          duration: CLOSE_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scrimOpacity, {
          toValue: 0,
          duration: CLOSE_MS,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) then();
      });
    },
    [reducedMotion, scrimOpacity, translateY]
  );

  const requestClose = useCallback(() => {
    if (!isSheet) {
      onClose();
      return;
    }
    animateOut(onClose);
  }, [animateOut, isSheet, onClose]);

  useEffect(() => {
    if (visible) return;
    opened.current = false;
    translateY.setValue(height);
    scrimOpacity.setValue(0);
  }, [height, scrimOpacity, translateY, visible]);

  useEffect(() => {
    if (Platform.OS !== "web" || !visible) return;
    if (typeof document === "undefined") return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  const onSheetLayout = useCallback(
    (measured: number) => {
      if (measured <= 0) return;
      sheetHeight.current = measured;

      if (opened.current) return;
      opened.current = true;

      if (reducedMotion) {
        translateY.setValue(0);
        scrimOpacity.setValue(1);
        return;
      }

      translateY.setValue(measured);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: OPEN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scrimOpacity, {
          toValue: 1,
          duration: OPEN_MS,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [reducedMotion, scrimOpacity, translateY]
  );

  return { translateY, scrimOpacity, animateOut, requestClose, onSheetLayout };
};
