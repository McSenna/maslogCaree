import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { AppointmentRecord } from "@/services/appointments";

import { canCancelAppointment, canRescheduleAppointment } from "../../appointmentPresenter";
import { PALETTE, withAlpha } from "@/theme/palette";

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
          color={PALETTE.blue[600]}
          background={palette.isDark ? withAlpha(PALETTE.blue[500], 0.2) : PALETTE.slate[50]}
          border={palette.isDark ? withAlpha(PALETTE.blue[500], 0.4) : PALETTE.blue[200]}
          onPress={() => onReschedule(appointment)}
        />
      ) : null}

      {showCancel && onCancel ? (
        <ActionButton
          label="Cancel Appointment"
          icon="x-circle"
          color={PALETTE.red[500]}
          background={palette.isDark ? withAlpha(PALETTE.red[500], 0.15) : PALETTE.red[50]}
          border={palette.isDark ? withAlpha(PALETTE.red[500], 0.3) : PALETTE.red[200]}
          onPress={() => onCancel(appointment)}
        />
      ) : null}
    </View>
  );
};

export default AppointmentSheetActions;
