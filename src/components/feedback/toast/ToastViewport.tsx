import { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { useResponsive } from "@/hooks/useResponsive";
import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";
import ToastCard from "./ToastCard";
import type { ToastMessage } from "./toastStore";
import { useToastState } from "./useToastState";

const ToastViewport = () => {
  const { message, bottomOffset } = useToastState();
  const { isMobile, pagePadding } = useResponsive();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const progress = useAnimatedValue(0);
  const [shown, setShown] = useState<ToastMessage | null>(message);
  if (message && message !== shown) setShown(message);

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: message ? 1 : 0,
      duration: message ? TIMING.enter : TIMING.exit,
      easing: EASING.out,
      useNativeDriver: USE_NATIVE_DRIVER,
    });
    animation.start(({ finished }) => {
      if (finished && !message) setShown(null);
    });
    return () => animation.stop();
  }, [message, progress]);

  if (!shown) return null;

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 0 : 12, 0] });

  return (
    <View
      style={{
        pointerEvents: "box-none",
        position: "absolute",
        left: isMobile ? pagePadding : undefined,
        right: pagePadding,
        bottom: Math.max(insets.bottom, 12) + 12 + bottomOffset,
        alignItems: isMobile ? "center" : "flex-end",
        zIndex: 1000,
      }}
    >
      <Animated.View style={{ width: "100%", maxWidth: 420, opacity: progress, transform: [{ translateY }] }}>
        <ToastCard key={shown.id} message={shown} />
      </Animated.View>
    </View>
  );
};

export default ToastViewport;
