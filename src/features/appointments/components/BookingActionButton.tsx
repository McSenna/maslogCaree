import type { ReactNode } from "react";
import { Platform, Pressable, Text } from "react-native";
import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "./appointmentTheme";

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

  return (
    <Pressable
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
      style={{
        height: APPOINTMENT_METRICS.buttonHeight,
        borderRadius: APPOINTMENT_METRICS.radiusField,
        backgroundColor: isPrimary
          ? APPOINTMENT_COLORS.actionGreen
          : APPOINTMENT_COLORS.neutralBg,
        opacity,
        ...(isPrimary ? { gap: 9 } : {}),
        ...Platform.select({ web: { cursor: "pointer" } as object }),
      }}
    >
      {icon}
      <Text
        style={{
          fontSize: 15.5,
          fontWeight: "700",
          color: isPrimary ? "#FFFFFF" : APPOINTMENT_COLORS.primary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default BookingActionButton;
