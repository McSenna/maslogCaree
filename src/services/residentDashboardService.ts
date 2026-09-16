import api from "@/services/api";
import type { AppointmentRecord } from "@/services/appointments";

export type NextAppointment = {
  id: string;
  consultationType: string;
  status: AppointmentRecord["status"];
  slotStart: string | null;
  slotEnd: string | null;
  assignedTo: string | null;
};

export type ResidentDashboardData = {
  resident: {
    id: string;
    fullname: string;
    firstName: string;
    profilePhoto: string | null;
  };
  statistics: {
    upcomingAppointments: number;
    completedAppointments: number;
    medicalRecords: number;
    unreadAnnouncements: number;
  };
  nextAppointment: NextAppointment | null;
};

type DashboardResponse = {
  success: boolean;
  dashboard: ResidentDashboardData;
};

export const fetchResidentDashboard = async (): Promise<ResidentDashboardData> => {
  const { data } = await api.get<DashboardResponse>("/resident/dashboard");
  return data.dashboard;
};
