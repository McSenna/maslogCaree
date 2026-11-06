import { useMemo } from "react";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { useNotificationActions } from "@/features/notifications/hooks/useNotificationActions";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import { monthlyVisitBars } from "@/utils/residentDashboard";
import { mapAnnouncements } from "./dashboard/dashboardMappers";
import { buildStats } from "./dashboard/dashboardStats";
import { useDashboardData } from "./dashboard/useDashboardData";
import { useDashboardHandlers } from "./dashboard/useDashboardHandlers";
import { PALETTE } from "@/theme/palette";

export const useResidentDashboard = () => {
  const appointmentsState = useResidentAppointments();
  const notificationsState = useNotificationsContext();
  const { data, loading, refreshing, error, loadedAt, load } = useDashboardData();
  const baseHandlers = useDashboardHandlers();
  const { handlePress: openNotification } = useNotificationActions();

  const stats = useMemo(() => buildStats(data), [data]);

  const monthlyVisits = useMemo(
    () => monthlyVisitBars(appointmentsState.appointments, PALETTE.blue[600]),
    [appointmentsState.appointments]
  );

  const announcements = useMemo(
    () => mapAnnouncements(notificationsState.notifications),
    [notificationsState.notifications]
  );

  // Rows are the latest notifications, so a tap does what it does in the inbox:
  // an announcement opens its details, anything else goes to its screen.
  const { notifications } = notificationsState;
  const handlers = useMemo(
    () => ({
      ...baseHandlers,
      onAnnouncement: (announcement: { id: string }) => {
        const item = notifications.find((n) => n.id === announcement.id);
        if (item) openNotification(item);
        else baseHandlers.onViewAllAnnouncements();
      },
    }),
    [baseHandlers, notifications, openNotification]
  );

  return {
    fullName: data?.resident.fullname ?? "",
    profilePhoto: data?.resident.profilePhoto ?? null,
    stats,
    unreadAnnouncements: data?.statistics.unreadAnnouncements ?? 0,
    nextAppointment: data?.nextAppointment ?? null,
    appointments: appointmentsState.appointments,
    monthlyVisits,
    announcements,
    loading,
    refreshing,
    loadedAt,
    error,
    reload: () => load("full"),
    refresh: async () => {
      await Promise.all([load("refresh"), notificationsState.refresh(), appointmentsState.revalidate()]);
    },
    handlers,
  };
};

export type ResidentDashboardModel = ReturnType<typeof useResidentDashboard>;
