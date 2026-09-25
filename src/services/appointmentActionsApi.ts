import api from "@/services/api";

import type { AppointmentRecord, RescheduleOptionsResponse } from "@/types/appointments.types";

export const assignAppointment = async (
  id: string,
  body: {
    missionScheduleId: string;
    categoryKey: string;
    slotStart: string;
    durationMinutes?: number;
  }): Promise<AppointmentRecord> => {
  const { data } = await api.patch<{ success: boolean; appointment: AppointmentRecord }>(
    `/appointments/${id}/assign`,
    body
  );
  return data.appointment;
};

export const reassignAppointment = async (
  id: string,
  body: {
    missionScheduleId: string;
    categoryKey: string;
    slotStart: string;
    durationMinutes?: number;
  }): Promise<AppointmentRecord> => {
  const { data } = await api.patch<{ success: boolean; appointment: AppointmentRecord }>(
    `/appointments/${id}/reassign`,
    body
  );
  return data.appointment;
};

export const rejectAppointment = async (id: string, reason?: string): Promise<AppointmentRecord> => {
  const { data } = await api.patch<{ success: boolean; appointment: AppointmentRecord }>(
    `/appointments/${id}/reject`,
    { reason }
  );
  return data.appointment;
};

export const cancelAppointment = async (id: string, reason?: string): Promise<AppointmentRecord> => {
  const { data } = await api.patch<{ success: boolean; appointment: AppointmentRecord }>(
    `/appointments/${id}/cancel`,
    { reason }
  );
  return data.appointment;
};

export const rescheduleAppointment = async (
  id: string,
  body: {
    missionScheduleId: string;
    slotStart: string;
  }): Promise<AppointmentRecord> => {
  const { data } = await api.patch<{ success: boolean; appointment: AppointmentRecord }>(
    `/appointments/${id}/reschedule`,
    body
  );
  return data.appointment;
};

export const fetchRescheduleOptions = async (id: string): Promise<RescheduleOptionsResponse> => {
  const { data } = await api.get<RescheduleOptionsResponse & { success: boolean }>(
    `/appointments/${id}/reschedule-options`
  );
  return data;
};

export const fetchCategoryAnalytics = async (missionScheduleId?: string): Promise<
  { _id: { category: string; status: string }; count: number }[]
> => {
  const { data } = await api.get<{
    success: boolean;
    analytics: { _id: { category: string; status: string }; count: number }[];
  }>("/appointments/analytics/by-category", {
    params: missionScheduleId ? { missionScheduleId } : undefined,
  });
  return data.analytics ?? [];
};
