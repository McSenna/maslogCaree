import api from "@/services/api";

import type { AppointmentRecord, MissionScheduleRecord } from "@/types/appointments.types";

export const fetchMissionSchedules = async (date?: string): Promise<MissionScheduleRecord[]> => {
  const { data } = await api.get<{ success: boolean; missionSchedules: MissionScheduleRecord[] }>(
    "/mission-schedule",
    { params: date ? { date } : undefined }
  );
  return data.missionSchedules ?? [];
};

export const createMissionSchedule = async (body: {
  date: string;
  startTime?: string;
  endTime?: string;
  morning?: { start: string; end: string };
  afternoon?: { start: string; end: string };
  categories: { categoryKey: string; durationMinutes?: number }[];
}): Promise<MissionScheduleRecord> => {
  const { data } = await api.post<{ success: boolean; missionSchedule: MissionScheduleRecord }>(
    "/mission-schedule",
    body
  );
  return data.missionSchedule;
};

export const updateMissionSchedule = async (
  id: string,
  body: {
    date?: string;
    startTime?: string;
    endTime?: string;
    morning?: { start: string; end: string };
    afternoon?: { start: string; end: string };
    categories: { categoryKey: string; durationMinutes?: number }[];
  }): Promise<MissionScheduleRecord> => {
  const { data } = await api.patch<{ success: boolean; missionSchedule: MissionScheduleRecord }>(
    `/mission-schedule/${id}`,
    body
  );
  return data.missionSchedule;
};

export const deleteMissionSchedule = async (id: string): Promise<{ success: boolean }> => {
  const { data } = await api.delete<{ success: boolean }>(`/mission-schedule/${id}`);
  return data;
};

export const fetchMissionDetail = async (id: string): Promise<{
  missionSchedule: MissionScheduleRecord;
  bookedAppointments: AppointmentRecord[];
}> => {
  const { data } = await api.get<{
    success: boolean;
    missionSchedule: MissionScheduleRecord;
    bookedAppointments: AppointmentRecord[];
  }>(`/mission-schedule/${id}`);
  return {
    missionSchedule: data.missionSchedule,
    bookedAppointments: data.bookedAppointments ?? [],
  };
};

export const fetchAvailableSlots = async (
  missionId: string,
  categoryKey: string,
  durationMinutes?: number,
  excludeAppointmentId?: string
): Promise<{ availableSlotStarts: string[]; suggestedNextSlotStart: string | null; durationMinutes: number }> => {
  const { data } = await api.get<{
    success: boolean;
    availableSlotStarts: string[];
    suggestedNextSlotStart: string | null;
    durationMinutes: number;
  }>(`/mission-schedule/${missionId}/available-slots`, {
    params: {
      categoryKey,
      durationMinutes,
      excludeAppointmentId,
    },
  });
  return {
    availableSlotStarts: data.availableSlotStarts ?? [],
    suggestedNextSlotStart: data.suggestedNextSlotStart ?? null,
    durationMinutes: data.durationMinutes,
  };
};
