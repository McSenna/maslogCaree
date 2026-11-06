import type { ReactNode } from "react";
import { Platform, Pressable, Text } from "react-native";
import { focusRing } from "@/components/data-table/focusRing";
import { useInteractionState } from "@/hooks/useInteractionState";
import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "./appointmentTheme";
import { PALETTE } from "@/theme/palette";

// Hover and press darken the green, or tint the neutral button blue.
const BACKGROUNDS = {
  primary: { rest: APPOINTMENT_COLORS.actionGreen, active: APPOINTMENT_COLORS.actionGreenPressed },
  neutral: { rest: APPOINTMENT_COLORS.neutralBg, active: APPOINTMENT_COLORS.surfaceTintStrong },
} as const;

type BookingActionButtonProps = {
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
  variant: "primary" | "neutral";
  disabled?: boolean;
  busy?: boolean;
  opacity?: number;
  icon?: ReactNode;
};

const BookingActionButton = ({
  label,
  accessibilityLabel,
  onPress,
  variant,
  disabled = false,
  busy = false,
  opacity = 1,
  icon,
}: BookingActionButtonProps) => {
  const isPrimary = variant === "primary";
  const { hovered, focused, pressed, handlers } = useInteractionState({ disabled });
  const active = hovered || pressed;
  const background = BACKGROUNDS[variant][active ? "active" : "rest"];

  return (
    <Pressable
      {...handlers}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, busy }}
      onPress={onPress}
      disabled={disabled}
      className={
        isPrimary
          ? "w-full flex-row items-center justify-center active:opacity-90"
          : "w-full items-center justify-center active:opacity-80"
      }
      style={[
        {
          height: APPOINTMENT_METRICS.buttonHeight,
          borderRadius: APPOINTMENT_METRICS.radiusField,
          backgroundColor: background,
          opacity,
          ...(isPrimary ? { gap: 9 } : {}),
          ...Platform.select({ web: { cursor: disabled ? "not-allowed" : "pointer" } as object }),
        },
        focused ? focusRing(APPOINTMENT_COLORS.primaryBright) : null,
      ]}
    >
      {icon}
      <Text
        style={{
          fontSize: 17.5,
          fontWeight: "700",
          color: isPrimary ? PALETTE.white : APPOINTMENT_COLORS.primaryBright,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default BookingActionButton;
