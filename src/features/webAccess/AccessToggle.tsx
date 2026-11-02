import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import { ActivityIndicator, Animated, Platform, Pressable, Text } from "react-native";

import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { useInteractionState } from "@/hooks/useInteractionState";
import { EASING, TIMING, useReducedMotion } from "@/theme/motion";
import { PALETTE } from "@/theme/palette";

type Props = {
  enabled: boolean;
  /** Reloading or saving: the switch waits. */
  busy: boolean;
  /** Saving: the switch also says so. */
  saving: boolean;
  label: string;
  onChange: () => void;
  hint?: string;
};

const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 22;
const KNOB = 18;
const INSET = (TRACK_HEIGHT - KNOB) / 2;

const AccessToggle = ({ enabled, busy, saving, label, onChange, hint = "Saves the access setting immediately" }: Props) => {
  const palette = useAdminSurfacePalette();
  const reducedMotion = useReducedMotion();
  const { focused, handlers } = useInteractionState({ disabled: busy });
  const progress = useAnimatedValue(enabled ? 1 : 0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: enabled ? 1 : 0,
      duration: reducedMotion ? 0 : TIMING.hover,
      easing: EASING.inOut,
      useNativeDriver: false,
    }).start();
  }, [enabled, progress, reducedMotion]);

  // React Native Web only handles Space automatically for button roles.
  const keyboardProps =
    Platform.OS === "web"
      ? {
          onKeyDown: (event: { key: string; repeat: boolean; preventDefault: () => void }) => {
            if (event.key !== " ") return;
            event.preventDefault();
            if (!busy && !event.repeat) onChange();
          },
        }
      : {};

  return (
    <Pressable
      {...keyboardProps}
      {...handlers}
      onPress={onChange}
      disabled={busy}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ checked: enabled, disabled: busy, busy: saving }}
      aria-checked={enabled}
      aria-disabled={busy}
      aria-busy={saving}
      className="min-h-11 flex-row items-center gap-2 rounded-lg px-1 web:cursor-pointer"
      style={{ outlineWidth: focused ? 2 : 0, outlineStyle: "solid", outlineColor: palette.focusRing, outlineOffset: 2 }}
    >
      {saving ? (
        <ActivityIndicator size="small" color={palette.primary} accessibilityLabel="Saving access setting" />
      ) : (
        <Feather name="globe" size={18} color={palette.primary} />
      )}
      <Text className="shrink" style={{ color: palette.body, fontSize: 15.5 }}>
        {`${label}: `}
        <Text className="font-bold" style={{ color: palette.heading }}>{enabled ? "On" : "Off"}</Text>
      </Text>
      {/* NativeWind ignores className on Animated.View on web, so the rounding lives in style. */}
      <Animated.View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          justifyContent: "center",
          opacity: saving ? 0.6 : 1,
          backgroundColor: progress.interpolate({ inputRange: [0, 1], outputRange: [palette.controlBorder, palette.primary] }),
        }}
      >
        <Animated.View
          style={{
            width: KNOB,
            height: KNOB,
            borderRadius: KNOB / 2,
            backgroundColor: PALETTE.white,
            transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [INSET, TRACK_WIDTH - KNOB - INSET] }) }],
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

export default AccessToggle;
