import { View } from "react-native";

import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import AppointmentAlert from "../AppointmentAlert";
import ConfirmationCheckbox from "../ConfirmationCheckbox";
import { DateTimeSection } from "./DateTimeSection";
import { ServiceSection } from "./ServiceSection";
import { VisitInfoSection } from "./VisitInfoSection";

/**
 * Step 1. On desktop the clinic hours sit beside it as the dialog's aside
 * (AppointmentModal), so they stay in view while the form scrolls; below that
 * the hours open under the service instead.
 */
export const BookingDetailsStep = ({ booking }: { booking: AppointmentBooking }) => {
  return (
    <View className="gap-5">
      <ServiceSection booking={booking} />
      <DateTimeSection booking={booking} />
      <VisitInfoSection booking={booking} />
      <ConfirmationCheckbox
        checked={booking.confirmed}
        onToggle={() => {
          booking.toggleConfirmed();
          booking.clearError("confirmed");
        }}
        error={booking.errors.confirmed}
      />
      {booking.submitError ? <AppointmentAlert tone="danger" message={booking.submitError} /> : null}
    </View>
  );
};

export default BookingDetailsStep;
