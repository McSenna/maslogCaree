import { APPOINTMENT_FIELD_ICONS } from "@/config/appointmentServices";

import type { AppointmentBooking } from "../hooks/useAppointmentBooking";
import { TEXT_LIMIT } from "./appointmentTheme";
import BookingScheduleField from "./BookingScheduleField";
import FormTextArea from "./FormTextArea";

/** Mission services: an open date and time the resident picks, then the reason and notes. */
const MissionVisitFields = ({ booking }: { booking: AppointmentBooking }) => (
  <>
    <BookingScheduleField
      hasService={Boolean(booking.serviceType)}
      slots={booking.slots}
      error={booking.errors.slot}
      onChange={() => booking.clearError("slot")}
    />

    <FormTextArea
      label="Reason for Visit / Symptoms"
      required
      placeholder="Describe your symptoms or reason for visit..."
      icon={APPOINTMENT_FIELD_ICONS.reason}
      value={booking.reason}
      onChangeText={(next) => {
        booking.setReason(next);
        if (next.trim()) booking.clearError("reason");
      }}
      error={booking.errors.reason}
      maxLength={TEXT_LIMIT}
    />

    <FormTextArea
      label="Additional Notes"
      optional
      placeholder="Add any additional information (optional)..."
      icon={APPOINTMENT_FIELD_ICONS.notes}
      value={booking.notes}
      onChangeText={booking.setNotes}
      maxLength={TEXT_LIMIT}
      minHeight={80}
    />
  </>
);

export default MissionVisitFields;
