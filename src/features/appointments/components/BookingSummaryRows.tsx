import { getStatusLabel } from "@/components/status/appointmentStatusModel";
import { formatBirthDate } from "@/features/auth/utils/dateOfBirth";
import type { AppointmentRecord } from "@/services/appointments";
import { isWeeklyService } from "@/utils/serviceDays";

import { appointmentReference, appointmentServiceLabel } from "../appointmentPresenter";
import { appDateKey } from "../hooks/booking/childDetailsRules";
import AppointmentSummaryRow from "./AppointmentSummaryRow";
import { formatScheduleDate, formatSlotTime } from "./reschedule/rescheduleFormat";

const timeRange = (appointment: AppointmentRecord): string => {
  if (!appointment.slotStart) return "Not set";
  const start = formatSlotTime(appointment.slotStart);
  return appointment.slotEnd ? `${start} to ${formatSlotTime(appointment.slotEnd)}` : start;
};

const minutesOf = (appointment: AppointmentRecord): number | null =>
  appointment.slotStart && appointment.slotEnd
    ? Math.round((new Date(appointment.slotEnd).getTime() - new Date(appointment.slotStart).getTime()) / 60000)
    : null;

/** The saved booking, row by row. An immunization shows the child and that its time was assigned, never a reason. */
const BookingSummaryRows = ({ appointment }: { appointment: AppointmentRecord }) => {
  const date = appointment.slotStart ? formatScheduleDate(appointment.slotStart) : "Not set";

  if (isWeeklyService(appointment.consultationType)) {
    const minutes = minutesOf(appointment);
    return (
      <>
        <AppointmentSummaryRow label="Service Type" value={appointmentServiceLabel(appointment)} />
        <AppointmentSummaryRow label="Child" value={appointment.childName?.trim() || "Not set"} />
        <AppointmentSummaryRow
          label="Date of Birth"
          value={appointment.childDateOfBirth ? formatBirthDate(appDateKey(appointment.childDateOfBirth)) : "Not set"}
        />
        <AppointmentSummaryRow label="Appointment Date" value={date} />
        <AppointmentSummaryRow label="Assigned Time" value={`${timeRange(appointment)} (assigned automatically)`} />
        <AppointmentSummaryRow label="Scheduling" value="First come, first served" />
        {minutes ? <AppointmentSummaryRow label="Interval" value={`${minutes} minutes`} /> : null}
        <AppointmentSummaryRow label="Reference" value={appointmentReference(appointment)} />
        <AppointmentSummaryRow label="Status" value={getStatusLabel(appointment.status, "resident")} />
      </>
    );
  }

  return (
    <>
      <AppointmentSummaryRow label="Service Type" value={appointmentServiceLabel(appointment)} />
      <AppointmentSummaryRow label="Date" value={date} />
      <AppointmentSummaryRow label="Time" value={timeRange(appointment)} />
      <AppointmentSummaryRow label="Reason for Visit" value={appointment.description?.trim() || "Not set"} />
      {appointment.additionalNotes?.trim() ? (
        <AppointmentSummaryRow label="Additional Notes" value={appointment.additionalNotes.trim()} />
      ) : null}
      <AppointmentSummaryRow label="Reference" value={appointmentReference(appointment)} />
      <AppointmentSummaryRow label="Status" value={getStatusLabel(appointment.status, "resident")} />
    </>
  );
};

export default BookingSummaryRows;
