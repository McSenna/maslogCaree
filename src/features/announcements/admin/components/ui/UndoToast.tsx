import { X } from "lucide-react-native";
import { useEffect } from "react";
import { Animated, Pressable, Text, View } from "react-native";

import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";

import type { DeleteToast } from "../../hooks/useUndoDelete";
import { useAnnouncementTheme } from "../../useAnnouncementTheme";

type UndoToastProps = {
  kind: DeleteToast;
  onUndo: () => void;
  onDismiss: () => void;
  wide?: boolean;
};

const MESSAGE: Record<Exclude<DeleteToast, null>, string> = {
  deleted: "Announcement deleted.",
  failed: "Could not delete. Try again.",
};

/** Sits over the list's bottom edge only while a delete can be undone or has failed. */
const UndoToast = ({ kind, onUndo, onDismiss, wide }: UndoToastProps) => {
  const { palette } = useAnnouncementTheme();
  const reducedMotion = useReducedMotion();
  const enter = useAnimatedValue(0);

  useEffect(() => {
    if (!kind) return;
    enter.setValue(reducedMotion ? 1 : 0);
    const animation = Animated.timing(enter, {
      toValue: 1,
      duration: TIMING.enter,
      easing: EASING.out,
      useNativeDriver: USE_NATIVE_DRIVER,
    });
    animation.start();
    return () => animation.stop();
  }, [kind, enter, reducedMotion]);

  if (!kind) return null;

  // Fades up 8px: enough to read as arriving, too little to pull the eye from the list.
  const motion = {
    opacity: enter,
    transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
  };

  return (
    <View
      pointerEvents="box-none"
      className={`absolute ${wide ? "bottom-8 left-0 w-[420px] max-w-full" : "bottom-5 left-3 right-3"}`}
    >
      {/* Animated.View takes no className on web, so it carries motion only. */}
      <Animated.View accessibilityLiveRegion="polite" role="status" style={motion}>
        <View className="min-h-12 flex-row items-center rounded-control bg-toast py-1 pl-4 pr-1">
          <Text className="flex-1 font-ps text-14 text-toast-text">{MESSAGE[kind]}</Text>
          {kind === "deleted" ? (
            <Pressable
              onPress={onUndo}
              accessibilityRole="button"
              accessibilityLabel="Undo delete"
              className="min-h-11 justify-center rounded-control px-3 web:cursor-pointer"
            >
              {({ pressed }) => (
                <Text className={`font-ps-semibold text-14 ${pressed ? "text-toast-text" : "text-toast-action"}`}>Undo</Text>
              )}
            </Pressable>
          ) : null}
          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            className="h-11 w-11 items-center justify-center rounded-control web:cursor-pointer"
          >
            <X size={18} color={palette["toast-icon"]} strokeWidth={1.9} />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default UndoToast;
