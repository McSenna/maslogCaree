import { useCallback, useMemo } from "react";
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
      onViewAppointment: () => go("/resident/appointments"),
      onViewAllAnnouncements: () => go("/resident/announcements"),
      onAnnouncement: (_announcement: Announcement) => go("/resident/announcements"),
      onViewAllServices: () => go("/resident/services"),
      onService: (_service: HealthService) => go("/resident/services"),
      onHealthTipsSeeMore: () => go("/resident/announcements"),
      onLearnMore: () => go("/resident/services"),
    }),
    [go]
  );
};
