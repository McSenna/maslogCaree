import type { AppointmentRecord } from "@/services/appointments";
import { appointmentServiceLabel } from "@/features/appointments/appointmentPresenter";
import { formatDate, formatDateTime } from "@/utils/dateFormatter";
import type { ProfileIconName } from "../types/profile.types";

export type AppointmentDetailLine = {
  key: string;
  icon: ProfileIconName;
  value: string;
};

const providerNameOf = (appointment: AppointmentRecord): string | null => {
  const provider =
    appointment.assignedBy ?? appointment.completedBy ?? appointment.preferredProvider;
  const name = provider?.fullname?.trim();
  if (!name) return null;

  const role = provider?.role?.trim();
  return role ? `${name} · ${role}` : name;
};

const scheduleOf = (appointment: AppointmentRecord): string => {
  if (appointment.slotStart) {
    const { date, time } = formatDateTime(appointment.slotStart);
    return `${date} at ${time}`;
  }

  if (appointment.missionSchedule?.date) {
    return `Mission schedule · ${formatDate(appointment.missionSchedule.date)}`;
  }

  return "Awaiting a schedule";
};

export const appointmentTitle = (appointment: AppointmentRecord): string =>
  appointmentServiceLabel(appointment);

export const appointmentDetailLines = (
  appointment: AppointmentRecord
): AppointmentDetailLine[] => {
  const lines: AppointmentDetailLine[] = [
    { key: "schedule", icon: "calendar", value: scheduleOf(appointment) },
  ];

  const provider = providerNameOf(appointment);
  if (provider) lines.push({ key: "provider", icon: "user", value: provider });

  if (appointment.declineReason?.trim()) {
    lines.push({ key: "reason", icon: "alert-circle", value: appointment.declineReason.trim() });
  }

  return lines;
};
