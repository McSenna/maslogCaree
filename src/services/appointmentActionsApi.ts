import api from "@/services/api";

import type { AppointmentRecord } from "@/types/appointments.types";

export async function assignAppointment(
  id: string,
  body: {
    missionScheduleId: string;
    categoryKey: string;
    slotStart: string;
    durationMinutes?: number;
  }
): Promise<AppointmentRecord> {
  const { data } = await api.patch<{ success: boolean; appointment: AppointmentRecord }>(
    `/appointments/${id}/assign`,
    body
  );
  return data.appointment;
}

export async function reassignAppointment(
  id: string,
  body: {
    missionScheduleId: string;
    categoryKey: string;
    slotStart: string;
    durationMinutes?: number;
  }
): Promise<AppointmentRecord> {
  const { data } = await api.patch<{ success: boolean; appointment: AppointmentRecord }>(
    `/appointments/${id}/reassign`,
    body
  );
  return data.appointment;
}

export async function rejectAppointment(id: string, reason?: string): Promise<AppointmentRecord> {
  const { data } = await api.patch<{ success: boolean; appointment: AppointmentRecord }>(
    `/appointments/${id}/reject`,
    { reason }
  );
  return data.appointment;
}

export async function fetchCategoryAnalytics(missionScheduleId?: string): Promise<
  { _id: { category: string; status: string }; count: number }[]
> {
  const { data } = await api.get<{
    success: boolean;
    analytics: { _id: { category: string; status: string }; count: number }[];
  }>("/appointments/analytics/by-category", {
    params: missionScheduleId ? { missionScheduleId } : undefined,
  });
  return data.analytics ?? [];
}
