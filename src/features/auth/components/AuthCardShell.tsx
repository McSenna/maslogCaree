import { useState, type ReactNode } from "react";
import { Animated } from "react-native";
import { useEntrance } from "@/components/landing/motion/useEntrance";
import type { AuthCardMetrics } from "./authCardMetricPresets";
import { authCardStyles as styles } from "./authCardStyles";

type AuthCardShellProps = {
  isMobile: boolean;
  compact: boolean;
  metrics: AuthCardMetrics;
  entranceDelay?: number;
  children: ReactNode;
};

const AuthCardShell = ({
  isMobile,
  compact,
  metrics,
  entranceDelay = 0,
  children,
}: AuthCardShellProps) => {
  const [hovered, setHovered] = useState(false);
  const entrance = useEntrance({ delay: entranceDelay, distance: 18 });

  const allowHover = !isMobile;

  return (
    <Animated.View
      onPointerEnter={allowHover ? () => setHovered(true) : undefined}
      onPointerLeave={allowHover ? () => setHovered(false) : undefined}
      style={[
        styles.card,
        isMobile ? styles.cardMobile : compact ? styles.cardDesktopCompact : styles.cardDesktop,
        {
          borderRadius: metrics.borderRadius,
          paddingHorizontal: metrics.paddingHorizontal,
          paddingTop: metrics.paddingTop,
          paddingBottom: metrics.paddingBottom,
        },
        hovered && styles.cardHovered,
        entrance,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default AuthCardShell;
