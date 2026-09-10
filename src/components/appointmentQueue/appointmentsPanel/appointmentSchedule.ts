import type { AppointmentRecord } from "@/services/appointments";
import { formatDateTime } from "@/utils/dateFormatter";

/**
 * When an appointment is booked for, in display form.
 *
 * A pending request has no slot yet, and says so rather than showing a dash in
 * both columns and leaving the reader to infer why.
 */
export function scheduleFor(appointment: AppointmentRecord): { date: string; time: string } {
  return appointment.slotStart
    ? formatDateTime(appointment.slotStart)
    : { date: "Not scheduled", time: "—" };
}
