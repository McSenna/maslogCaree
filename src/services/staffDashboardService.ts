import api from "@/services/api";

export type DashboardService = { key: string; label: string };

export type StaffSummary = {
  today: number;
  waiting: number;
  processing: number;
  completedToday: number;
  upcoming: number;
  pending: number;
  totalPatients: number;
};

export type ServiceBreakdownEntry = {
  key: string;
  label: string;
  today: number;
  completed: number;
};

export type StaffTrendPoint = {
  key: string;
  label: string;
  date: string;
  count: number;
  byService: Record<string, number>;
};

export type StaffAppointment = {
  _id: string;
  consultationType: string;
  serviceLabel: string;
  status: "pending" | "confirmed" | "declined" | "rescheduled" | "processing" | "completed";
  slotStart: string | null;
  slotEnd: string | null;
  isUrgent: boolean;
  patientName: string;
  medicalRecord: string | null;
};

export type ActivityHighlight = {
  key: string;
  label: string;
  value: string;
  unit: string;
};

export type StaffActivity = {
  _id: string;
  medicalRecord: string;
  appointment: string | null;
  patientName: string;
  providerName: string;
  serviceType: string;
  serviceLabel: string;
  completedAt: string;
  itemsGivenCount: number;
  highlights: ActivityHighlight[];
};

export type StaffDashboardData = {
  role: string;
  services: DashboardService[];
  summary: StaffSummary;
  serviceBreakdown: ServiceBreakdownEntry[];
  trend: StaffTrendPoint[];
  queue: StaffAppointment[];
  upcoming: StaffAppointment[];
  recentActivity: StaffActivity[];
  generatedAt: string;
};

const EMPTY_SUMMARY: StaffSummary = {
  today: 0,
  waiting: 0,
  processing: 0,
  completedToday: 0,
  upcoming: 0,
  pending: 0,
  totalPatients: 0,
};

interface StaffDashboardResponse extends Partial<StaffDashboardData> {
  success: boolean;
  message: string;
}

export const fetchStaffDashboard = async (): Promise<StaffDashboardData> => {
  const { data } = await api.get<StaffDashboardResponse>("/staff/dashboard");

  return {
    role: data.role ?? "",
    services: data.services ?? [],
    summary: { ...EMPTY_SUMMARY, ...(data.summary ?? {}) },
    serviceBreakdown: data.serviceBreakdown ?? [],
    trend: data.trend ?? [],
    queue: data.queue ?? [],
    upcoming: data.upcoming ?? [],
    recentActivity: data.recentActivity ?? [],
    generatedAt: data.generatedAt ?? new Date().toISOString(),
  };
};
