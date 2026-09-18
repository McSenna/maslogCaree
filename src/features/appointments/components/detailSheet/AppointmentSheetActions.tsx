import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { AppointmentRecord } from "@/services/appointments";

import { canCancelAppointment, canRescheduleAppointment } from "../../appointmentPresenter";

type Props = {
  appointment: AppointmentRecord;
  palette: QueuePalette;
  onReschedule?: (appointment: AppointmentRecord) => void;
  onCancel?: (appointment: AppointmentRecord) => void;
};

const ActionButton = ({
  label,
  icon,
  color,
  background,
  border,
  onPress,
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  background: string;
  border: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={{
      flex: 1,
      height: 44,
      borderRadius: 10,
      backgroundColor: background,
      borderWidth: 1,
      borderColor: border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    }}
  >
    <Feather name={icon} size={14} color={color} />
    <Text style={{ fontSize: 13, fontWeight: "600", color }}>{label}</Text>
  </Pressable>
);

export const AppointmentSheetActions = ({
  appointment,
  palette,
  onReschedule,
  onCancel,
}: Props) => {
  const showReschedule = Boolean(onReschedule) && canRescheduleAppointment(appointment);
  const showCancel = Boolean(onCancel) && canCancelAppointment(appointment);

  if (!showReschedule && !showCancel) return null;

  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      {showReschedule && onReschedule ? (
        <ActionButton
          label="Reschedule"
          icon="calendar"
          color="#0284C7"
          background={palette.isDark ? "rgba(2, 132, 199, 0.2)" : "#F0F9FF"}
          border={palette.isDark ? "rgba(2, 132, 199, 0.4)" : "#BAE6FD"}
          onPress={() => onReschedule(appointment)}
        />
      ) : null}

      {showCancel && onCancel ? (
        <ActionButton
          label="Cancel Appointment"
          icon="x-circle"
          color="#EF4444"
          background={palette.isDark ? "rgba(239, 68, 68, 0.15)" : "#FEF2F2"}
          border={palette.isDark ? "rgba(239, 68, 68, 0.3)" : "#FECACA"}
          onPress={() => onCancel(appointment)}
        />
      ) : null}
    </View>
  );
};

export default AppointmentSheetActions;
