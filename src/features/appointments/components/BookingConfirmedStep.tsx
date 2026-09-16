import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { AppointmentBooking } from "../hooks/useAppointmentBooking";
import { QUEUE_MESSAGE } from "../constants/bookingCopy";
import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "./appointmentTheme";
import AppointmentSummaryRow from "./AppointmentSummaryRow";
import BookingActionButton from "./BookingActionButton";

type BookingConfirmedStepProps = {
  booking: AppointmentBooking;
  onClose: () => void;
};

const BookingConfirmedStep = ({ booking, onClose }: BookingConfirmedStepProps) => {
  return (
    <View style={{ gap: 16 }}>
      <View
        className="items-center"
        style={{
          borderRadius: APPOINTMENT_METRICS.radiusCard,
          backgroundColor: APPOINTMENT_COLORS.surfaceTint,
          paddingHorizontal: 18,
          paddingVertical: 24,
          gap: 10,
        }}
      >
        <View
          className="items-center justify-center"
          style={{
            width: 62,
            height: 62,
            borderRadius: 31,
            backgroundColor: APPOINTMENT_COLORS.successBg,
          }}
        >
          <Feather name="check" size={30} color={APPOINTMENT_COLORS.success} />
        </View>

        <Text
          accessibilityRole="header"
          className="text-center"
          style={{ fontSize: 19, fontWeight: "800", color: APPOINTMENT_COLORS.primary }}
        >
          Appointment Requested
        </Text>
        <Text
          className="text-center"
          style={{ fontSize: 13.5, lineHeight: 20, color: APPOINTMENT_COLORS.mutedText }}
        >
          {QUEUE_MESSAGE}
        </Text>
      </View>

      <View
        style={{
          borderRadius: APPOINTMENT_METRICS.radiusCard,
          borderWidth: 1,
          borderColor: APPOINTMENT_COLORS.border,
          padding: 14,
          gap: 12,
        }}
      >
        <AppointmentSummaryRow
          label="Service Type"
          value={booking.selectedService?.label ?? "—"}
        />
        <AppointmentSummaryRow label="Healthcare Provider" value="To be assigned" />
        <AppointmentSummaryRow label="Reason for Visit" value={booking.reason.trim() || "—"} />
        {booking.notes.trim() ? (
          <AppointmentSummaryRow label="Additional Notes" value={booking.notes.trim()} />
        ) : null}
        <AppointmentSummaryRow
          label="Schedule"
          value="Assigned automatically by the health team"
        />
        <AppointmentSummaryRow label="Status" value="Pending" />
      </View>

      <BookingActionButton
        variant="primary"
        label="Done"
        accessibilityLabel="Done"
        onPress={onClose}
      />
    </View>
  );
};

export default BookingConfirmedStep;
