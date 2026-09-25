import { useCallback, useEffect, useRef } from "react";
import { Animated } from "react-native";

import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

const OPEN_MS = TIMING.modal;
const CLOSE_MS = TIMING.exit;

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

  const translateY = useAnimatedValue(height);
  const scrimOpacity = useAnimatedValue(0);

  // Slide distance. Starts at the window height and is replaced by the real
  // sheet height as soon as one layout pass has run, so re-opens travel exactly
  // as far as the sheet is tall.
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
          easing: EASING.drawer,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(scrimOpacity, {
          toValue: 0,
          duration: CLOSE_MS,
          useNativeDriver: USE_NATIVE_DRIVER,
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

  /**
   * The entrance is driven by `visible`, not by the sheet's layout event.
   *
   * The date picker opens as a modal nested inside the registration dialog's
   * modal, and Android can mount that inner window without ever delivering a
   * layout event to this sheet — or deliver it to a view hierarchy it then
   * recreates. While the slide-in hung off `onLayout`, that left `translateY`
   * at its closed value and the sheet parked below the fold with only its
   * header peeking above the bottom edge.
   */
  useEffect(() => {
    if (!visible) {
      opened.current = false;
      translateY.setValue(sheetHeight.current);
      scrimOpacity.setValue(0);
      return;
    }

    if (opened.current) return;
    opened.current = true;

    if (!isSheet || reducedMotion) {
      translateY.setValue(0);
      scrimOpacity.setValue(1);
      return;
    }

    translateY.setValue(sheetHeight.current);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: OPEN_MS,
        easing: EASING.drawer,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(scrimOpacity, {
        toValue: 1,
        duration: OPEN_MS,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    ]).start(({ finished }) => {
      // Pin the open position. A native-driven animation cut short by Android
      // recreating the dialog's views would otherwise leave the sheet wherever
      // it stopped. A drag interrupts it too, but that reports `finished:
      // false` and the pan responder owns the value from then on.
      if (finished) {
        translateY.setValue(0);
        scrimOpacity.setValue(1);
      }
    });
  }, [isSheet, reducedMotion, scrimOpacity, translateY, visible]);

  const onSheetLayout = useCallback((measured: number) => {
    if (measured > 0) sheetHeight.current = measured;
  }, []);

  return { translateY, scrimOpacity, animateOut, requestClose, onSheetLayout };
};
