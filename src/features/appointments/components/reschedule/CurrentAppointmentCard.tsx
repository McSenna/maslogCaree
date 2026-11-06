import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import type { AppointmentRecord } from "@/types/appointments.types";

import { appointmentServiceLabel, appointmentWhen } from "../../appointmentPresenter";

/** The appointment being moved, so the resident can compare it with the new choice. */
export const CurrentAppointmentCard = ({
  palette,
  appointment,
}: {
  palette: ResidentDialogPalette;
  appointment: AppointmentRecord;
}) => (
  <View
    style={{
      padding: 14,
      borderRadius: 12,
      backgroundColor: palette.card,
      borderColor: palette.border,
      borderWidth: 1,
    }}
  >
    <Text
      style={{
        fontSize: 13,
        fontWeight: "600",
        color: palette.muted,
        textTransform: "uppercase",
        letterSpacing: 0.4,
      }}
    >
      Current Appointment
    </Text>
    <Text style={{ fontSize: 18, fontWeight: "700", color: palette.heading, marginTop: 2 }}>
      {appointmentServiceLabel(appointment)}
    </Text>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
      <Feather name="clock" size={13} color={palette.muted} />
      <Text style={{ fontSize: 15, color: palette.body }}>{appointmentWhen(appointment)}</Text>
    </View>
  </View>
);

export default CurrentAppointmentCard;
