import { useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { Animated, Text } from "react-native";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { useThemeColors } from "@/hooks/useThemeColors";
import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";
import { RADII } from "@/theme/radius";
import { getStatusMeta, type StatusAudience } from "./appointmentStatusModel";

type AppointmentStatusBadgeProps = {
  status: string | null | undefined;
  audience?: StatusAudience;
  size?: "sm" | "md";
};

const useStatusChangePulse = (statusKey: string) => {
  const reducedMotion = useReducedMotion();
  const progress = useAnimatedValue(1);
  const previous = useRef(statusKey);

  useEffect(() => {
    if (previous.current === statusKey) return;
    previous.current = statusKey;
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: reducedMotion ? TIMING.exit : TIMING.enter,
      easing: EASING.out,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [statusKey, reducedMotion, progress]);

  return {
    opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
    transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 1 : 0.94, 1] }) }],
  };
};

const AppointmentStatusBadge = ({ status, audience = "staff", size = "sm" }: AppointmentStatusBadgeProps) => {
  const colors = useThemeColors();
  const meta = getStatusMeta(status, audience);
  const tone = colors[meta.tone];
  const pulse = useStatusChangePulse(meta.key);
  const compact = size === "sm";

  return (
    <Animated.View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Status: ${meta.label}`}
      style={{
        ...pulse,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: compact ? 8 : 12,
        paddingVertical: compact ? 4 : 6,
        borderRadius: RADII.pill,
        backgroundColor: tone.bg,
        borderWidth: 1,
        borderColor: tone.border,
      }}
    >
      <Feather name={meta.icon} size={compact ? 12 : 14} color={tone.fg} />
      <Text numberOfLines={1} style={{ color: tone.fg, fontSize: compact ? 12 : 13, fontWeight: "600" }}>
        {meta.label}
      </Text>
    </Animated.View>
  );
};

export default AppointmentStatusBadge;
