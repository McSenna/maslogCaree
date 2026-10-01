import type { AppointmentBooking } from "../hooks/useAppointmentBooking";
import ChildBirthDateField from "./ChildBirthDateField";
import FormTextInput from "./FormTextInput";
import WeeklyScheduleField from "./WeeklyScheduleField";

/** Immunization asks for the child and a Wednesday only: no reason, notes, or time. */
const ImmunizationVisitFields = ({ booking }: { booking: AppointmentBooking }) => (
  <>
    <FormTextInput
      label="Child's Name"
      required
      placeholder="Enter the child's full name"
      icon="user"
      value={booking.childName}
      onChangeText={(next) => {
        booking.setChildName(next);
        if (next.trim()) booking.clearError("childName");
      }}
      error={booking.errors.childName}
      autoCapitalize="words"
      autoComplete="off"
      textContentType="none"
      maxLength={120}
    />
    <ChildBirthDateField
      value={booking.childDob}
      onChange={(next) => {
        booking.setChildDob(next);
        booking.clearError("childDob");
      }}
      error={booking.errors.childDob}
    />
    <WeeklyScheduleField
      weeklyDays={booking.weeklyDays}
      serviceLabel={booking.selectedService?.label ?? "Immunization"}
      error={booking.errors.slot}
      onChange={() => booking.clearError("slot")}
    />
  </>
);

export default ImmunizationVisitFields;
