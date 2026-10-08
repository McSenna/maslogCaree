import { useEffect, useRef } from "react";
import { Animated } from "react-native";

import { Badge, useCellSelfAlign } from "@/components/data-table";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { EASING, TIMING, USE_NATIVE_DRIVER, useReducedMotion } from "@/theme/motion";
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

/** An appointment's status as the shared badge, pulsing once when the status changes. */
const AppointmentStatusBadge = ({ status, audience = "staff", size = "sm" }: AppointmentStatusBadgeProps) => {
  const meta = getStatusMeta(status, audience);
  const pulse = useStatusChangePulse(meta.key);
  const alignSelf = useCellSelfAlign();

  return (
    <Animated.View style={[pulse, { alignSelf, maxWidth: "100%" }]}>
      <Badge tone={meta.tone} icon={meta.icon} label={meta.label} spokenAs="Status" size={size} />
    </Animated.View>
  );
};

export default AppointmentStatusBadge;
