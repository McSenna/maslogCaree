import api from "@/services/api";
import type { AppointmentRecord } from "@/services/appointments";

/** The next appointment, as the dashboard endpoint returns it. */
export type NextAppointment = {
  id: string;
  consultationType: string;
  status: AppointmentRecord["status"];
  slotStart: string | null;
  slotEnd: string | null;
  /** The health worker who took the appointment, when one is assigned. */
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

/**
 * The signed-in resident's dashboard.
 *
 * No identifier is sent: the server reads the resident from the bearer token
 * that `api`'s request interceptor attaches, which is what makes this
 * impossible to point at somebody else's record.
 */
export const fetchResidentDashboard = async (): Promise<ResidentDashboardData> => {
  const { data } = await api.get<DashboardResponse>("/resident/dashboard");
  return data.dashboard;
};
