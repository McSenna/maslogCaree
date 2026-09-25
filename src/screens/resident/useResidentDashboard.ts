import { useMemo } from "react";
import { healthTip } from "@/data/residentDashboardData";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import { summarizeResidentAppointments } from "@/utils/residentDashboard";
import { mapAnnouncements } from "./dashboard/dashboardMappers";
import { buildStats } from "./dashboard/dashboardStats";
import { useDashboardData } from "./dashboard/useDashboardData";
import { useDashboardHandlers } from "./dashboard/useDashboardHandlers";

const RECENT_APPOINTMENTS_LIMIT = 3;

export const useResidentDashboard = () => {
  const appointmentsState = useResidentAppointments();
  const notificationsState = useNotificationsContext();
  const { data, loading, refreshing, error, load } = useDashboardData();
  const handlers = useDashboardHandlers();

  const stats = useMemo(() => buildStats(data), [data]);

  const recentAppointments = useMemo(
    () =>
      summarizeResidentAppointments(
        appointmentsState.appointments,
        "#0B63F6"
      ).pastAppointments.slice(0, RECENT_APPOINTMENTS_LIMIT),
    [appointmentsState.appointments]
  );

  const announcements = useMemo(
    () => mapAnnouncements(notificationsState.notifications),
    [notificationsState.notifications]
  );

  return {
    profilePhoto: data?.resident.profilePhoto ?? null,
    stats,
    nextAppointment: data?.nextAppointment ?? null,
    recentAppointments,
    announcements,
    healthTip,
    loading,
    refreshing,
    error,
    reload: () => load("full"),
    refresh: async () => {
      await Promise.all([load("refresh"), notificationsState.refresh()]);
    },
    handlers,
  };
};

export type ResidentDashboardModel = ReturnType<typeof useResidentDashboard>;
