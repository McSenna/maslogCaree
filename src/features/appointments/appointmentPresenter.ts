import type { AppointmentRecord } from "@/services/appointments";
import { getServiceLabel } from "@/config/appointmentServices";

export type AppointmentStatus = AppointmentRecord["status"];

export const RESIDENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Approved",
  rescheduled: "Rescheduled",
  processing: "Being seen",
  completed: "Completed",
  declined: "Declined",
};

export const residentStatusLabel = (status: string | undefined): string => {
  return RESIDENT_STATUS_LABELS[status as AppointmentStatus] ?? "Unknown";
};

export const statusToneKey = (status: string | undefined): AppointmentStatus => {
  return (RESIDENT_STATUS_LABELS[status as AppointmentStatus] ? status : "pending") as AppointmentStatus;
};

export const appointmentServiceLabel = (appointment: AppointmentRecord): string => {
  return getServiceLabel(appointment.consultationType) || appointment.consultationType;
};

export const appointmentWhen = (appointment: AppointmentRecord): string => {
  if (!appointment.slotStart) return "Awaiting a schedule";

  return new Date(appointment.slotStart).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const appointmentSortTime = (appointment: AppointmentRecord): number => {
  const raw = appointment.slotStart || appointment.createdAt;
  const t = raw ? new Date(raw).getTime() : 0;
  return Number.isNaN(t) ? 0 : t;
};

export type AppointmentStep = {
  key: string;
  label: string;
  at: string | null;
  tone: "done" | "declined";
};

const STEP_LABELS: Record<AppointmentStatus, string> = {
  pending: "Appointment requested",
  confirmed: "Appointment approved",
  rescheduled: "Appointment rescheduled",
  processing: "Healthcare service performed",
  completed: "Completed",
  declined: "Appointment declined",
};

export const buildAppointmentTimeline = (appointment: AppointmentRecord): AppointmentStep[] => {
  const history = appointment.statusHistory ?? [];

  if (history.length) {
    return history.map((entry, index) => ({
      key: `${entry.status}-${index}`,
      label: STEP_LABELS[entry.status] ?? entry.status,
      at: entry.timestamp ?? null,
      tone: entry.status === "declined" ? "declined" : "done",
    }));
  }

  return (
    [
      { key: "created", label: STEP_LABELS.pending, at: appointment.createdAt ?? null },
      { key: "approved", label: STEP_LABELS.confirmed, at: appointment.approvedAt ?? null },
      { key: "processing", label: STEP_LABELS.processing, at: appointment.processingAt ?? null },
      { key: "completed", label: STEP_LABELS.completed, at: appointment.completedAt ?? null },
    ] as const
  )
    .filter((step) => step.at)
    .map((step) => ({ ...step, tone: "done" as const }));
};

export const medicalRecordIdOf = (appointment: AppointmentRecord): string | null => {
  if (appointment.status !== "completed") return null;
  const id = appointment.medicalRecord;
  return typeof id === "string" && id.trim() ? id : null;
};

export const appointmentReference = (appointment: AppointmentRecord): string => {
  return `APT-${String(appointment._id).slice(-8).toUpperCase()}`;
};
