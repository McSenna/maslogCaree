import { useEffect, useState, type ReactNode } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

type ProfileOverlayProps = {
  visible: boolean;
  onClose: () => void;
  accessibilityLabel: string;
  children: ReactNode;
  dismissOnBackdropPress?: boolean;
};

const OPEN_MS = TIMING.enter;
const CLOSE_MS = TIMING.exit - 30;

const ProfileOverlay = ({
  visible,
  onClose,
  accessibilityLabel,
  children,
  dismissOnBackdropPress = true,
}: ProfileOverlayProps) => {
  const opacity = useAnimatedValue(0);
  const scale = useAnimatedValue(0.98);
  const [mounted, setMounted] = useState(visible);
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const restScale = reducedMotion ? 1 : 0.98;

  useWebModalBehavior(visible, onClose);

  // Mount synchronously on open; unmount only once the close animation has finished.
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      opacity.setValue(0);
      scale.setValue(restScale);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: OPEN_MS,
          easing: EASING.out,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: OPEN_MS,
          easing: EASING.out,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: CLOSE_MS,
        easing: EASING.out,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(scale, {
        toValue: restScale,
        duration: CLOSE_MS,
        easing: EASING.out,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [visible, restScale, opacity, scale]);

  if (!mounted) return null;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Close ${accessibilityLabel}`}
            onPress={dismissOnBackdropPress ? onClose : undefined}
            disabled={!dismissOnBackdropPress}
            style={{
              flex: 1,
              backgroundColor: "rgba(15, 23, 42, 0.40)",
              ...(Platform.OS === "web"
                ? ({ backdropFilter: "blur(4px)" } as object)
                : null),
            }}
          />
        </Animated.View>

        <Animated.View
          accessibilityViewIsModal
          {...(Platform.OS === "web" ? { role: "dialog" as const } : null)}
          aria-modal
          accessibilityLabel={accessibilityLabel}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 12,
            opacity,
            transform: [{ scale }],
            pointerEvents: "box-none",
          }}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ProfileOverlay;
