import { useEffect, useState } from "react";
import { Animated, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useKeyboardTop } from "@/components/ui/sheetLayout/useKeyboardTop";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { useResponsive } from "@/hooks/useResponsive";
import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";
import { SPACING } from "@/theme/spacing";
import ToastCard from "./ToastCard";
import type { ToastMessage } from "./toastStore";
import { useToastState, type ToastLayerKind } from "./useToastState";

const MAX_WIDTH = 420;

/**
 * Mounted once at the app root, and once inside every modal (see AppModal) so
 * the toast stays visible over whatever is open. Phones get a full-width toast
 * above the bottom navigation; wider screens pin it to the bottom right. A
 * screen can ask for the top instead (setToastPlacement), centred at any width.
 */
const ToastViewport = ({ layer = "root", active = true }: { layer?: ToastLayerKind; active?: boolean }) => {
  const { message, bottomOffset, placement, setPaused } = useToastState(layer, active);
  const { isMobile, pagePadding } = useResponsive();
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const keyboardTop = useKeyboardTop(true);
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

  const atTop = placement === "top";
  const resting = Math.max(insets.bottom, SPACING.md) + SPACING.md + bottomOffset;
  // An open keyboard would cover a bottom toast, so it rides above the keys.
  const aboveKeyboard = keyboardTop === null ? 0 : windowHeight - keyboardTop + SPACING.md;
  // It slides in from the edge it rests on.
  const enterFrom = reducedMotion ? 0 : atTop ? -12 : 12;
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [enterFrom, 0] });

  return (
    <View
      style={{
        pointerEvents: "box-none",
        position: "absolute",
        left: isMobile || atTop ? pagePadding : undefined,
        right: pagePadding,
        ...(atTop
          ? { top: Math.max(insets.top, SPACING.md) + SPACING.md }
          : { bottom: Math.max(resting, aboveKeyboard) }),
        alignItems: isMobile || atTop ? "center" : "flex-end",
        zIndex: 1000,
      }}
    >
      <Animated.View style={{ width: "100%", maxWidth: MAX_WIDTH, opacity: progress, transform: [{ translateY }] }}>
        <ToastCard key={shown.id} message={shown} onPauseChange={setPaused} />
      </Animated.View>
    </View>
  );
};

export default ToastViewport;
