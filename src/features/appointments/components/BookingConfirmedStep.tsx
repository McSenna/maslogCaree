import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { AppointmentRecord } from "@/services/appointments";
import { isQueuedService } from "@/utils/serviceDays";
import { CONFIRMED_MESSAGE, QUEUED_MESSAGE, QUEUED_TITLE, SCHEDULED_FROM_QUEUE_MESSAGE } from "../constants/bookingCopy";
import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "./appointmentTheme";
import BookingActionButton from "./BookingActionButton";
import BookingSummaryRows from "./BookingSummaryRows";

type BookingConfirmedStepProps = {
  appointment: AppointmentRecord;
  onClose: () => void;
};

type Outcome = { title: string; message: string; icon: "check" | "clock"; color: string; background: string };

// Read from the saved status, never from the form: a queued request is only
// "confirmed" if a mission had room and the queue already placed it.
const outcomeOf = (appointment: AppointmentRecord): Outcome => {
  if (appointment.status === "pending") {
    return { title: QUEUED_TITLE, message: QUEUED_MESSAGE, icon: "clock", color: APPOINTMENT_COLORS.waiting, background: APPOINTMENT_COLORS.waitingBg };
  }
  const message = isQueuedService(appointment.consultationType) ? SCHEDULED_FROM_QUEUE_MESSAGE : CONFIRMED_MESSAGE;
  return { title: "Appointment Confirmed", message, icon: "check", color: APPOINTMENT_COLORS.success, background: APPOINTMENT_COLORS.successBg };
};

/** Shows the booking or request exactly as the server saved it, never the form's local copy. */
const BookingConfirmedStep = ({ appointment, onClose }: BookingConfirmedStepProps) => {
  const outcome = outcomeOf(appointment);
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
            backgroundColor: outcome.background,
          }}
        >
          <Feather name={outcome.icon} size={30} color={outcome.color} />
        </View>

        <Text
          accessibilityRole="header"
          className="text-center"
          style={{ fontSize: 21, fontWeight: "800", color: APPOINTMENT_COLORS.primary }}
        >
          {outcome.title}
        </Text>
        <Text
          className="text-center"
          style={{ fontSize: 15.5, lineHeight: 22, color: APPOINTMENT_COLORS.mutedText }}
        >
          {outcome.message}
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
