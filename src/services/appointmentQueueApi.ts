import api from "@/services/api";

import type {
  AppointmentRecord,
  ConsultationCategory,
  QueueOverview,
  ServiceProvider,
} from "@/types/appointments.types";

export async function fetchConsultationCategories(): Promise<ConsultationCategory[]> {
  const { data } = await api.get<{ success: boolean; categories: ConsultationCategory[] }>(
    "/consultation-categories"
  );
  return data.categories ?? [];
}

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

export async function fetchQueueOverview(
  options?: { categoryKey?: string }
): Promise<QueueOverview> {
  const { data } = await api.get<{ success: boolean } & QueueOverview>(
    "/appointments/overview",
    { params: options?.categoryKey ? { categoryKey: options.categoryKey } : undefined }
  );
  return {
    queueRole: data.queueRole,
    stats: data.stats,
    statusCounts: data.statusCounts,
    schedule: data.schedule ?? [],
    breakdown: data.breakdown ?? [],
  };
}

export async function fetchAppointmentsByStatus(
  status: AppointmentRecord["status"],
  options?: { categoryKey?: string }
): Promise<AppointmentRecord[]> {
  const { data } = await api.get<{ success: boolean; appointments: AppointmentRecord[] }>(
    "/appointments",
    {
      params: options?.categoryKey
        ? { status, categoryKey: options.categoryKey }
        : { status },
    }
  );
  return data.appointments ?? [];
}

export async function fetchPendingAppointments(): Promise<AppointmentRecord[]> {
  const { data } = await api.get<{ success: boolean; appointments: AppointmentRecord[] }>(
    "/appointments/pending"
  );
  return data.appointments ?? [];
}
