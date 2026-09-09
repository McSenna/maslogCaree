import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text } from "react-native";

export type ToastTone = "success" | "error";

export type ToastState = { message: string; tone: ToastTone } | null;

const AUTO_DISMISS_MS = 3500;

/**
 * Local toast state for a screen.
 *
 * Deliberately not an app-wide provider: only this feature needs feedback so
 * far, and wrapping the root layout would touch navigation for every other
 * screen.
 */
export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = useCallback((message: string, tone: ToastTone = "success") => {
    setToast({ message, tone });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return { toast, showToast, hideToast };
}

const TONES: Record<ToastTone, { bg: string; icon: keyof typeof Feather.glyphMap }> = {
  success: { bg: "#16A34A", icon: "check-circle" },
  error: { bg: "#EF4444", icon: "alert-circle" },
};

export default function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  // Held in a ref so the auto-dismiss effect doesn't re-run when the parent
  // re-renders with a new callback identity.
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    if (!toast) return;

    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
        dismissRef.current();
      });
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [toast, opacity]);

  if (!toast) return null;

  const tone = TONES[toast.tone];

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{ opacity, position: "absolute", left: 16, right: 16, bottom: 24, alignItems: "center" }}
    >
      <Pressable
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel={`${toast.message}. Tap to dismiss.`}
        accessibilityLiveRegion="polite"
        className="w-full max-w-[440px] flex-row items-center gap-2.5 rounded-xl px-4 py-3"
        style={{ backgroundColor: tone.bg }}
      >
        <Feather name={tone.icon} size={16} color="#fff" />
        <Text className="flex-1 text-[13.5px] font-semibold text-white">{toast.message}</Text>
      </Pressable>
    </Animated.View>
  );
}
