import { residentDialogPalette } from "@/design/residentDialogTheme";

import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import { BookingFieldError } from "../BookingFieldError";
import BookingScheduleField from "../BookingScheduleField";
import { RegularScheduleField } from "../regularSchedule/RegularScheduleField";
import { FormSection } from "./FormSection";

// The booking dialog has a fixed light surface (lightSurface on the shell).
const PICKER_PALETTE = residentDialogPalette(false);

/**
 * Section 2: BP checking picks a date then a time on its own calendar; a
 * mission service picks one of the mission dates and an open time.
 */
export const DateTimeSection = ({ booking }: { booking: AppointmentBooking }) => (
  <FormSection title="Date & Time" divided>
    {booking.regular ? (
      <>
        <RegularScheduleField
          palette={PICKER_PALETTE}
          serviceLabel={booking.selectedService?.label ?? "This service"}
          picker={booking.regularPicker}
          onChange={() => booking.clearError("slot")}
          hasError={Boolean(booking.errors.slot)}
          showHours={false}
        />
        <BookingFieldError message={booking.errors.slot} />
      </>
    ) : (
      <BookingScheduleField
        hasService={Boolean(booking.serviceType)}
        slots={booking.slots}
        error={booking.errors.slot}
        onChange={() => booking.clearError("slot")}
        showLabel={false}
      />
    )}
  </FormSection>
);

export default DateTimeSection;
