import { residentDialogPalette } from "@/design/residentDialogTheme";

import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import { BookingFieldError } from "../BookingFieldError";
import { RegularScheduleField } from "../regularSchedule/RegularScheduleField";
import { FormSection } from "./FormSection";
import { QueueSchedulingNote } from "./QueueSchedulingNote";
import { QueueWaitingNote } from "./QueueWaitingNote";

// The booking dialog has a fixed light surface (lightSurface on the shell).
const PICKER_PALETTE = residentDialogPalette(false);

// A doctor request already waiting blocks this one, so the note says that instead.
const QueueNote = ({ booking }: { booking: AppointmentBooking }) => {
  const waitingKey = booking.queueBlocked ? booking.waitingRequest?.consultationType : null;
  return waitingKey ? <QueueWaitingNote serviceKey={waitingKey} /> : <QueueSchedulingNote />;
};

/**
 * Section 2: BP checking and prenatal pick a date then a time on their own
 * calendar; a queued doctor service picks nothing and says why, or says that
 * the resident's earlier doctor request has to be scheduled first. Before a
 * service is chosen there is nothing to show, since either may follow.
 */
export const DateTimeSection = ({ booking }: { booking: AppointmentBooking }) => {
  if (!booking.regular && !booking.queued) return null;
  return (
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
        <QueueNote booking={booking} />
      )}
    </FormSection>
  );
};

export default DateTimeSection;
