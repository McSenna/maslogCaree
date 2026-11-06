import { View } from "react-native";

import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import AppointmentAlert from "../AppointmentAlert";
import ConfirmationCheckbox from "../ConfirmationCheckbox";
import { DateTimeSection } from "./DateTimeSection";
import { WithScheduleSidebar } from "./WithScheduleSidebar";
import { ServiceSection } from "./ServiceSection";
import { VisitInfoSection } from "./VisitInfoSection";

/**
 * Step 1. On desktop the form sits beside the schedule sidebar, so the hours
 * stay in view while a date is chosen; below that it is one column and the
 * hours open under the service instead.
 */
export const BookingDetailsStep = ({ booking }: { booking: AppointmentBooking }) => {
  const form = (
    <View className="min-w-0 flex-1 gap-5">
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

  return <WithScheduleSidebar booking={booking}>{form}</WithScheduleSidebar>;
};

export default BookingDetailsStep;
