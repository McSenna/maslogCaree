import { APPOINTMENT_FIELD_ICONS } from "@/config/appointmentServices";
import { useResponsive } from "@/hooks/useResponsive";

import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import { TEXT_LIMIT } from "../appointmentTheme";
import FormTextArea from "../FormTextArea";
import { FormSection } from "./FormSection";

/** Section 3: why the resident is coming, and anything else the health worker should know. */
export const VisitInfoSection = ({ booking }: { booking: AppointmentBooking }) => {
  // Shorter boxes beside the sidebar on desktop; taller ones on touch screens, which type less per line.
  const { isDesktop } = useResponsive();
  return (
    <FormSection title="Visit Information" divided>
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
        minHeight={isDesktop ? 48 : 96}
      />
      <FormTextArea
        label="Additional Notes"
        optional
        placeholder="Add any additional information..."
        icon={APPOINTMENT_FIELD_ICONS.notes}
        value={booking.notes}
        onChangeText={booking.setNotes}
        maxLength={TEXT_LIMIT}
        minHeight={isDesktop ? 32 : 80}
      />
    </FormSection>
  );
};

export default VisitInfoSection;
