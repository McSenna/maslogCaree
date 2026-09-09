import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWebModalBehavior } from "@/hooks/useWebModalBehavior";

type ProfileOverlayProps = {
  visible: boolean;
  onClose: () => void;
  /** Announced to assistive technology as the dialog's name. */
  accessibilityLabel: string;
  children: ReactNode;
  /** Overlay tap dismisses by default; forms opt out. */
  dismissOnBackdropPress?: boolean;
};

const OPEN_MS = 200;
const CLOSE_MS = 160;

/**
 * Shared dialog shell: dimmed backdrop, fade + subtle scale, Escape, and a
 * locked page behind it.
 *
 * Both the web profile modal and the log-out confirmation are built on this so
 * they animate and dismiss identically.
 */
const ProfileOverlay = ({
  visible,
  onClose,
  accessibilityLabel,
  children,
  dismissOnBackdropPress = true,
}: ProfileOverlayProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.98)).current;
  const [mounted, setMounted] = useState(visible);
  const insets = useSafeAreaInsets();

  useWebModalBehavior(visible, onClose);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      opacity.setValue(0);
      scale.setValue(0.98);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: OPEN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: OPEN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!mounted) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: CLOSE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.98,
        duration: CLOSE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [visible, mounted, opacity, scale]);

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
              // Keeps the dashboard recognisable behind the dialog (§5).
              ...(Platform.OS === "web"
                ? ({ backdropFilter: "blur(4px)" } as object)
                : null),
            }}
          />
        </Animated.View>

        <Animated.View
          // `accessibilityViewIsModal` is what stops VoiceOver/TalkBack from
          // reaching the screen underneath.
          accessibilityViewIsModal
          // react-native-web maps this to role="dialog"; native has no such role.
          {...(Platform.OS === "web" ? { role: "dialog" as const } : null)}
          aria-modal
          accessibilityLabel={accessibilityLabel}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            // The gutter lives here, not on the card. A card sized `width:
            // "100%"` with its own horizontal margin resolves to the full
            // parent width *plus* those margins, so it overflows the screen and
            // pushes anything on its right — the Log Out button — out of view.
            paddingHorizontal: 20,
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 12,
            opacity,
            transform: [{ scale }],
          }}
          pointerEvents="box-none"
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ProfileOverlay;
