import { formatAppointmentDate } from "@/data/residentDashboardData";
import type { AppointmentRecord } from "@/services/appointments";

export const appointmentDate = (appointment: AppointmentRecord): string =>
  formatAppointmentDate(appointment.slotStart ?? appointment.createdAt ?? "");

export const COLUMNS = { date: 1.15, service: 1.5, status: 1 } as const;
