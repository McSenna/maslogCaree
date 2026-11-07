import api from "@/services/api";

import type {
  AppointmentRecord,
  BookingOptionsResponse,
  ConsultationCategory,
  QueueOverview,
  RegularOptions,
  RegularQuery,
  ServiceProvider,
} from "@/types/appointments.types";
import { readRegularOptions } from "@/features/appointments/regularSchedule/scheduleRules";

const UNEXPECTED_SCHEDULE = "The schedule could not be read. Please try again.";

export const fetchConsultationCategories = async (): Promise<ConsultationCategory[]> => {
  const { data } = await api.get<{ success: boolean; categories: ConsultationCategory[] }>(
    "/consultation-categories"
  );
  return data.categories ?? [];
};

export const fetchServiceProviders = async (serviceType: string): Promise<ServiceProvider[]> => {
  const { data } = await api.get<{ success: boolean; providers: ServiceProvider[] }>(
    "/appointment-providers",
    { params: { serviceType } }
  );
  return data.providers ?? [];
};

export const fetchBookingOptions = async (consultationType: string): Promise<BookingOptionsResponse> => {
  const { data } = await api.get<Partial<BookingOptionsResponse> & { success: boolean }>(
    "/appointments/booking-options",
    { params: { consultationType } }
  );
  return {
    consultationType: data.consultationType ?? consultationType,
    scheduling: data.scheduling === "weekly" ? "weekly" : "mission",
    schedules: data.schedules ?? [],
    days: data.days ?? [],
    intervalMinutes: data.intervalMinutes ?? null,
  };
};

/** A regular-schedule service (BP checking): the month's days and, when chosen, one date's open times. */
export const fetchRegularBookingOptions = async (consultationType: string, query: RegularQuery): Promise<RegularOptions> => {
  const { data } = await api.get<unknown>("/appointments/booking-options", { params: { consultationType, ...query } });
  const options = readRegularOptions(data);
  if (!options) throw new Error(UNEXPECTED_SCHEDULE);
  return options;
};

/** A queued doctor service: what is needed, never when; the queue assigns the time. */
type QueuedRequestBody = {
  consultationType: string;
  description: string;
  additionalNotes?: string;
  requestKey: string;
};

/** A weekly service (immunization): the server picks the time, so only the day is sent. */
type WeeklyBookingBody = {
  consultationType: string;
  childName: string;
  childDateOfBirth: string;
  appointmentDate: string;
  requestKey: string;
};

/** A regular-schedule service (BP checking, prenatal): the resident's chosen date and start. */
type RegularBookingBody = {
  consultationType: string;
  description: string;
  additionalNotes?: string;
  appointmentDate: string;
  slotStart: string;
  requestKey: string;
};

/**
 * Books (or, for a queued service, requests) in one call. `requestKey` stays the
 * same across retries of one attempt, so a repeat returns the first result.
 */
export const createResidentAppointment = async (
  body: QueuedRequestBody | WeeklyBookingBody | RegularBookingBody
): Promise<{ message?: string; appointment: AppointmentRecord }> => {
  const { data } = await api.post<{
    success: boolean;
    message?: string;
    appointment: AppointmentRecord;
  }>("/appointments", body);
  return data;
};

export const fetchMyAppointments = async (): Promise<AppointmentRecord[]> => {
  const { data } = await api.get<{ success: boolean; appointments: AppointmentRecord[] }>(
    "/appointments/me"
  );
  return data.appointments ?? [];
};

// The stat cards index these objects by key, so a response without them must
// read as zeros rather than crash the whole role shell.
const EMPTY_QUEUE_STATS: QueueOverview["stats"] = { today: 0, pending: 0, upcoming: 0, declined: 0 };
const EMPTY_STATUS_COUNTS: QueueOverview["statusCounts"] = {
  pending: 0,
  confirmed: 0,
  rescheduled: 0,
  declined: 0,
};

export const fetchQueueOverview = async (
  options?: { categoryKey?: string }
): Promise<QueueOverview> => {
  const { data } = await api.get<{ success: boolean } & QueueOverview>(
    "/appointments/overview",
    { params: options?.categoryKey ? { categoryKey: options.categoryKey } : undefined }
  );
  return {
    queueRole: data.queueRole,
    stats: { ...EMPTY_QUEUE_STATS, ...data.stats },
    statusCounts: { ...EMPTY_STATUS_COUNTS, ...data.statusCounts },
    schedule: data.schedule ?? [],
    breakdown: data.breakdown ?? [],
  };
};

export const fetchAppointmentsByStatus = async (
  status: AppointmentRecord["status"],
  options?: { categoryKey?: string }
): Promise<AppointmentRecord[]> => {
  const { data } = await api.get<{ success: boolean; appointments: AppointmentRecord[] }>(
    "/appointments",
    {
      params: options?.categoryKey
        ? { status, categoryKey: options.categoryKey }
        : { status },
    }
  );
  return data.appointments ?? [];
};

export const fetchPendingAppointments = async (): Promise<AppointmentRecord[]> => {
  const { data } = await api.get<{ success: boolean; appointments: AppointmentRecord[] }>(
    "/appointments/pending"
  );
  return data.appointments ?? [];
};
