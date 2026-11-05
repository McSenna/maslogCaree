import { useCallback, useMemo } from "react";
import { requestAppointmentDetail } from "@/features/appointments/appointmentDetailRequest";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";
import type { Announcement, HealthService } from "@/types/residentDashboard";

export const useDashboardHandlers = () => {
  const router = useGuardedNavigation();

  const go = useCallback(
    (href: string) => {
      router.push(href as never);
    },
    [router]
  );

  return useMemo(
    () => ({
      onViewAllAppointments: () => go("/resident/appointments"),
      onViewAppointment: (appointment: { id: string }) => {
        requestAppointmentDetail(appointment.id);
        go("/resident/appointments");
      },
      onViewAllAnnouncements: () => go("/resident/announcements"),
      onAnnouncement: (_announcement: Announcement) => go("/resident/announcements"),
      onViewAllServices: () => go("/resident/services"),
      onService: (_service: HealthService) => go("/resident/services"),
    }),
    [go]
  );
};
