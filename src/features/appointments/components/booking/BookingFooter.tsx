import { ActivityIndicator, View } from "react-native";

import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import { APPOINTMENT_COLORS } from "../appointmentTheme";
import BookingActionButton from "../BookingActionButton";

// A queued service is requested, not booked: nothing is reserved until the queue places it.
const submitLabel = (queued: boolean) => (queued ? "Request appointment" : "Book appointment");

const primaryLabel = (reviewing: boolean, submitting: boolean, queued: boolean): string => {
  if (!reviewing) return "Continue to review";
  if (submitting) return queued ? "Sending request..." : "Booking...";
  return submitLabel(queued);
};

type Props = {
  booking: AppointmentBooking;
  /** Asks first when there is input to lose. */
  onCancel: () => void;
};

/** The pinned actions: Cancel and Continue on Details, Back and Book (or Request) on Review. */
export const BookingFooter = ({ booking, onCancel }: Props) => {
  const reviewing = booking.stage === "review";
  const { submitting } = booking;
  // A doctor request already in the queue blocks a second; the note above the footer says why.
  const primaryDisabled = submitting || booking.servicesUnavailable || booking.queueBlocked;

  return (
    <View className="flex-row gap-4">
      <View className="flex-1">
        <BookingActionButton
          variant="neutral"
          label={reviewing ? "Back" : "Cancel"}
          accessibilityLabel={reviewing ? "Back to appointment details" : "Cancel booking"}
          onPress={reviewing ? booking.backToDetails : onCancel}
          disabled={submitting}
          opacity={submitting ? 0.6 : 1}
        />
      </View>
      <View className="flex-1">
        <BookingActionButton
          variant="primary"
          label={primaryLabel(reviewing, submitting, booking.queued)}
          accessibilityLabel={reviewing ? submitLabel(booking.queued) : "Continue to review"}
          onPress={reviewing ? () => void booking.submit() : booking.continueToReview}
          disabled={primaryDisabled}
          busy={submitting}
          opacity={primaryDisabled ? 0.55 : 1}
          icon={submitting ? <ActivityIndicator size="small" color={APPOINTMENT_COLORS.white} /> : undefined}
        />
      </View>
    </View>
  );
};

export default BookingFooter;
