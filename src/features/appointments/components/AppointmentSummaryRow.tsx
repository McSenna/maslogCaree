import { Text, View } from "react-native";
import { APPOINTMENT_COLORS } from "./appointmentTheme";

/** One labelled line on the booking receipt. */
export default function AppointmentSummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={{ gap: 2 }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: APPOINTMENT_COLORS.mutedText,
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: "500", color: APPOINTMENT_COLORS.bodyText }}>
        {value}
      </Text>
    </View>
  );
}
