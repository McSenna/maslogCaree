import { ActivityIndicator, View } from "react-native";

import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import { APPOINTMENT_COLORS } from "../appointmentTheme";
import BookingActionButton from "../BookingActionButton";

const primaryLabel = (reviewing: boolean, submitting: boolean): string => {
  if (!reviewing) return "Continue to review";
  return submitting ? "Booking..." : "Book appointment";
};

type Props = {
  booking: AppointmentBooking;
  /** Asks first when there is input to lose. */
  onCancel: () => void;
};

/** The pinned actions: Cancel and Continue on Details, Back and Book on Review. */
export const BookingFooter = ({ booking, onCancel }: Props) => {
  const reviewing = booking.stage === "review";
  const { submitting } = booking;
  const primaryDisabled = submitting || booking.servicesUnavailable;

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
          label={primaryLabel(reviewing, submitting)}
          accessibilityLabel={reviewing ? "Book appointment" : "Continue to review"}
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
