import type { AppointmentRecord } from "@/services/appointments";
import { formatDateTime } from "@/utils/dateFormatter";

export const scheduleFor = (appointment: AppointmentRecord): { date: string; time: string } => {
  return appointment.slotStart
    ? formatDateTime(appointment.slotStart)
    : { date: "Not scheduled", time: "—" };
};
