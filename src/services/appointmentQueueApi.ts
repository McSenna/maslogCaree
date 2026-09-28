import api from "@/services/api";

import type {
  AppointmentRecord,
  ConsultationCategory,
  QueueOverview,
  ServiceProvider,
} from "@/types/appointments.types";

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

export const createResidentAppointment = async (body: {
  consultationType: string;
  description: string;
  additionalNotes?: string;
  preferredProvider?: string | null;
  isUrgent?: boolean;
}): Promise<{ message?: string; appointment: AppointmentRecord }> => {
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
