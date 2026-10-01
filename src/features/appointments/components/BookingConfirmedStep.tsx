import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { AppointmentRecord } from "@/services/appointments";
import { CONFIRMED_MESSAGE } from "../constants/bookingCopy";
import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "./appointmentTheme";
import BookingActionButton from "./BookingActionButton";
import BookingSummaryRows from "./BookingSummaryRows";

type BookingConfirmedStepProps = {
  appointment: AppointmentRecord;
  onClose: () => void;
};

/** Shows the booking exactly as the server saved it, never the form's local copy. */
const BookingConfirmedStep = ({ appointment, onClose }: BookingConfirmedStepProps) => {
  return (
    <View style={{ gap: 16 }}>
      <View
        accessible
        accessibilityLiveRegion="polite"
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
          Appointment Confirmed
        </Text>
        <Text
          className="text-center"
          style={{ fontSize: 13.5, lineHeight: 20, color: APPOINTMENT_COLORS.mutedText }}
        >
          {CONFIRMED_MESSAGE}
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
        <BookingSummaryRows appointment={appointment} />
      </View>

      <BookingActionButton variant="primary" label="Done" accessibilityLabel="Done" onPress={onClose} />
    </View>
  );
};

export default BookingConfirmedStep;
