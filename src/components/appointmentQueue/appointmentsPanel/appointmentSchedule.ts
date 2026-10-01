import type { AppointmentRecord } from "@/services/appointments";
import { formatDateTime } from "@/utils/dateFormatter";

/**
 * A pending request that sorts first because the resident rescheduled it.
 * Once booked, the status badge already reads "Rescheduled".
 */
export const isRescheduledRequest = (appointment: AppointmentRecord): boolean =>
  appointment.status === "pending" && Boolean(appointment.reschedulePriorityAt);

export const scheduleFor = (appointment: AppointmentRecord): { date: string; time: string } => {
  return appointment.slotStart
    ? formatDateTime(appointment.slotStart)
    : { date: "Not scheduled", time: "No time yet" };
};
