import api from "@/services/api";

export type ConsultationCategory = {
  key: string;
  label: string;
  durationMinutes?: number;
  durationMinutesMin?: number;
  durationMinutesMax?: number;
};

export type AppointmentRecord = {
  _id: string;
  consultationType: string;
  description?: string;
  status: "pending" | "confirmed" | "declined" | "rescheduled";
  isUrgent?: boolean;
  ageTier?: number;
  prioritySortKey?: number;
  createdAt?: string;
  resident?: {
    fullname?: string;
    email?: string;
    dateOfBirth?: string;
  };
  missionSchedule?: {
    _id: string;
    date?: string;
    morningStart?: string;
    morningEnd?: string;
    afternoonStart?: string;
    afternoonEnd?: string;
  } | null;
  assignedCategoryKey?: string | null;
  assignedDurationMinutes?: number | null;
  slotStart?: string | null;
  slotEnd?: string | null;
  declineReason?: string;
  assignedBy?: { _id?: string; fullname?: string; role?: string } | null;
};

export type MissionScheduleRecord = {
  _id: string;
  date: string;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  categories: { categoryKey: string; durationMinutes: number }[];
};

export async function fetchConsultationCategories(): Promise<ConsultationCategory[]> {
  const { data } = await api.get<{ success: boolean; categories: ConsultationCategory[] }>(
    "/consultation-categories"
  );
  return data.categories ?? [];
}

export async function createResidentAppointment(body: {
  consultationType: string;
  description: string;
  isUrgent?: boolean;
}): Promise<{ message?: string; appointment: AppointmentRecord }> {
  const { data } = await api.post<{
    success: boolean;
    message?: string;
    appointment: AppointmentRecord;
  }>("/appointments", body);
  return data;
}

export async function fetchMyAppointments(): Promise<AppointmentRecord[]> {
  const { data } = await api.get<{ success: boolean; appointments: AppointmentRecord[] }>(
    "/appointments/me"
  );
  return data.appointments ?? [];
}

export async function fetchPendingAppointments(): Promise<AppointmentRecord[]> {
  const { data } = await api.get<{ success: boolean; appointments: AppointmentRecord[] }>(
    "/appointments/pending"
  );
  return data.appointments ?? [];
}

export async function fetchMissionSchedules(date?: string): Promise<MissionScheduleRecord[]> {
  const { data } = await api.get<{ success: boolean; missionSchedules: MissionScheduleRecord[] }>(
    "/mission-schedule",
    { params: date ? { date } : undefined }
  );
  return data.missionSchedules ?? [];
}

export async function createMissionSchedule(body: {
  date: string;
  // Preferred (new) format: a single start/end time range.
  startTime?: string;
  endTime?: string;
  // Legacy format: two windows.
  morning?: { start: string; end: string };
  afternoon?: { start: string; end: string };
  categories: { categoryKey: string; durationMinutes?: number }[];
}): Promise<MissionScheduleRecord> {
  const { data } = await api.post<{ success: boolean; missionSchedule: MissionScheduleRecord }>(
    "/mission-schedule",
    body
  );
  return data.missionSchedule;
}

export async function updateMissionSchedule(
  id: string,
  body: {
    date?: string;
    startTime?: string;
    endTime?: string;
    morning?: { start: string; end: string };
    afternoon?: { start: string; end: string };
    categories: { categoryKey: string; durationMinutes?: number }[];
  }
): Promise<MissionScheduleRecord> {
  const { data } = await api.patch<{ success: boolean; missionSchedule: MissionScheduleRecord }>(
    `/mission-schedule/${id}`,
    body
  );
  return data.missionSchedule;
}

export async function deleteMissionSchedule(id: string): Promise<{ success: boolean }> {
  const { data } = await api.delete<{ success: boolean }>(`/mission-schedule/${id}`);
  return data;
}

export async function fetchMissionDetail(id: string): Promise<{
  missionSchedule: MissionScheduleRecord;
  bookedAppointments: AppointmentRecord[];
}> {
  const { data } = await api.get<{
    success: boolean;
    missionSchedule: MissionScheduleRecord;
    bookedAppointments: AppointmentRecord[];
  }>(`/mission-schedule/${id}`);
  return {
    missionSchedule: data.missionSchedule,
    bookedAppointments: data.bookedAppointments ?? [],
  };
}

export async function fetchAvailableSlots(
  missionId: string,
  categoryKey: string,
  durationMinutes?: number,
  excludeAppointmentId?: string
): Promise<{ availableSlotStarts: string[]; suggestedNextSlotStart: string | null; durationMinutes: number }> {
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
}

export async function suggestNextSlot(
  missionScheduleId: string,
  categoryKey: string,
  durationMinutes?: number,
  excludeAppointmentId?: string
): Promise<string | null> {
  const { data } = await api.get<{
    success: boolean;
    suggestedNextSlotStart: string | null;
  }>("/appointments/suggest-slot", {
    params: { missionScheduleId, categoryKey, durationMinutes, excludeAppointmentId },
  });
  return data.suggestedNextSlotStart ?? null;
}

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
