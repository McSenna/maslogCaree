import api from "@/services/api";

export type ConsultationCategory = {
  key: string;
  label: string;
  /** Display order set by the server catalogue. */
  order?: number;
  /** One-line explanation of what the service covers. */
  description?: string;
  /** False for services the health team schedules but residents cannot book. */
  residentBookable?: boolean;
  /**
   * The staff role that owns the service — whose queue it lands in and who may
   * be requested for it. Decided by the server catalogue and sent with every
   * category, so no screen has to know the routing rules to display them.
   */
  queueRole?: string;
  durationMinutes?: number;
  durationMinutesMin?: number;
  durationMinutesMax?: number;
};

/** One service's share of the caller's own queue. */
export type ServiceBreakdownRow = {
  key: string;
  label: string;
  count: number;
};

/**
 * The Appointment & Queue screen's header figures, in one request.
 *
 * Every number is counted by the server against the caller's own services, so
 * the client never receives — or totals — a record belonging to another role's
 * queue.
 */
export type QueueOverview = {
  /** The scope the server applied: a role, or "admin" for every queue. */
  queueRole: string;
  stats: {
    /** Booked and starting today. */
    today: number;
    /** Requests still waiting to be scheduled. */
    pending: number;
    /** Booked and starting after today. */
    upcoming: number;
    declined: number;
  };
  statusCounts: {
    pending: number;
    confirmed: number;
    rescheduled: number;
    declined: number;
  };
  /** Today's booked appointments, already ordered by start time. */
  schedule: AppointmentRecord[];
  breakdown: ServiceBreakdownRow[];
};

/** A health worker a resident may request, as returned for one service. */
export type ServiceProvider = {
  _id: string;
  fullname: string;
  role: string;
  profilePhoto?: string | null;
};

export type AppointmentRecord = {
  _id: string;
  consultationType: string;
  description?: string;
  additionalNotes?: string;
  /** Who the resident asked for — a preference, not the assignment. */
  preferredProvider?: { _id?: string; fullname?: string; role?: string } | null;
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

/**
 * The health workers authorised to deliver one service.
 *
 * The server decides eligibility from the service catalogue and re-checks the
 * choice on submit, so this list is what to offer — never what to trust.
 */
export async function fetchServiceProviders(serviceType: string): Promise<ServiceProvider[]> {
  const { data } = await api.get<{ success: boolean; providers: ServiceProvider[] }>(
    "/appointment-providers",
    { params: { serviceType } }
  );
  return data.providers ?? [];
}

export async function createResidentAppointment(body: {
  consultationType: string;
  description: string;
  additionalNotes?: string;
  preferredProvider?: string | null;
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

/**
 * Header figures, today's schedule and the service breakdown.
 *
 * One call rather than three: the server counts all of it in the database, so
 * asking separately would be three round trips for numbers that must agree
 * with each other anyway.
 */
export async function fetchQueueOverview(): Promise<QueueOverview> {
  const { data } = await api.get<{ success: boolean } & QueueOverview>(
    "/appointments/overview"
  );
  return {
    queueRole: data.queueRole,
    stats: data.stats,
    statusCounts: data.statusCounts,
    schedule: data.schedule ?? [],
    breakdown: data.breakdown ?? [],
  };
}

/**
 * The caller's appointments in one standing.
 *
 * The server scopes the result to the signed-in role's own services, so this
 * never has to filter by service on the client — and could not, since records
 * outside that scope are never sent.
 */
export async function fetchAppointmentsByStatus(
  status: AppointmentRecord["status"]
): Promise<AppointmentRecord[]> {
  const { data } = await api.get<{ success: boolean; appointments: AppointmentRecord[] }>(
    "/appointments",
    { params: { status } }
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
