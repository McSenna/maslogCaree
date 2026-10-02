import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import { Animated, Pressable, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { ANNOUNCEMENT_DARK, ANNOUNCEMENT_LIGHT } from "@/theme/announcementTokens";
import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";

type UndoToastProps = {
  /** Null hides the toast. */
  message: string | null;
  /** Shown only while the action can still be taken back. */
  onUndo?: () => void;
  /** Screen-reader name for Undo, e.g. "Undo delete". */
  undoLabel?: string;
  onDismiss: () => void;
  /** Absolute position inside the parent, e.g. "bottom-8 left-0 w-[420px] max-w-full". */
  positionClassName: string;
};

/**
 * The dark bar that follows an undoable action, or its failure. Draws with
 * the admin `--an-*` classes, so the screen root must carry those variables.
 */
const UndoToast = ({ message, onUndo, undoLabel = "Undo", onDismiss, positionClassName }: UndoToastProps) => {
  const isDark = useTheme().resolvedTheme === "dark";
  const iconColor = (isDark ? ANNOUNCEMENT_DARK : ANNOUNCEMENT_LIGHT)["toast-icon"];
  const reducedMotion = useReducedMotion();
  const enter = useAnimatedValue(0);
  const visible = message !== null;

  useEffect(() => {
    if (!visible) return;
    enter.setValue(reducedMotion ? 1 : 0);
    const animation = Animated.timing(enter, { toValue: 1, duration: TIMING.enter, easing: EASING.out, useNativeDriver: USE_NATIVE_DRIVER });
    animation.start();
    return () => animation.stop();
  }, [visible, enter, reducedMotion]);

  if (!visible) return null;

  // Fades up 8px: enough to read as arriving, too little to pull the eye from the list.
  const motion = { opacity: enter, transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] };

  return (
    <View pointerEvents="box-none" className={`absolute ${positionClassName}`}>
      {/* Animated.View takes no className on web, so it carries motion only. */}
      <Animated.View accessibilityLiveRegion="polite" role="status" style={motion}>
        <View className="min-h-12 flex-row items-center rounded-control bg-toast py-1 pl-4 pr-1">
          <Text className="flex-1 font-normal text-14 text-toast-text">{message}</Text>
          {onUndo ? (
            <Pressable onPress={onUndo} accessibilityRole="button" accessibilityLabel={undoLabel} className="min-h-11 justify-center rounded-control px-3 web:cursor-pointer">
              {({ pressed, hovered }) => (
                <Text className={`font-semibold text-14 ${pressed || hovered ? "text-toast-text" : "text-toast-action"}`}>Undo</Text>
              )}
            </Pressable>
          ) : null}
          <Pressable onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Dismiss" className="h-11 w-11 items-center justify-center rounded-control web:cursor-pointer">
            <Feather name="x" size={18} color={iconColor} />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default UndoToast;
