import { useMemo } from "react";
import { Animated, PanResponder } from "react-native";

import { showAlert } from "@/utils/notify";
import { USE_NATIVE_DRIVER } from "@/theme/motion";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

const DISMISS_DISTANCE = 96;

type Options = {
  onClose: () => void;
  isSubmitting: boolean;
  isSucceeded: boolean;
  hasUnsavedInput: () => boolean;
};

export const useDialogDismiss = ({
  onClose,
  isSubmitting,
  isSucceeded,
  hasUnsavedInput,
}: Options) => {
  const requestClose = () => {
    if (isSubmitting) return;
    if (!hasUnsavedInput()) {
      onClose();
      return;
    }
    showAlert("Discard registration?", "The details you have entered will not be saved.", [
      { text: "Keep editing", style: "cancel" },
      { text: "Discard", style: "destructive", onPress: onClose },
    ]);
  };

  const dragY = useAnimatedValue(0);
  const settle = () =>
    Animated.spring(dragY, { toValue: 0, useNativeDriver: USE_NATIVE_DRIVER, bounciness: 0 }).start();

  const dragHandlers = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) => gesture.dy > 6,
        onPanResponderMove: (_event, gesture) => {
          if (gesture.dy > 0) dragY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_event, gesture) => {
          settle();
          if (gesture.dy > DISMISS_DISTANCE) requestClose();
        },
        onPanResponderTerminate: settle,
      }).panHandlers,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSubmitting, isSucceeded]
  );

  return { dragY, dragHandlers, requestClose };
};
