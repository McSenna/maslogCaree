import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  healthServices,
  healthTip,
  quickActions,
} from "@/data/residentDashboardData";
import { useNotifications } from "@/hooks/useNotifications";
import { useResidentAppointments } from "@/hooks/useResidentAppointments";
import {
  fetchResidentDashboard,
  type ResidentDashboardData,
} from "@/services/residentDashboardService";
import type { Announcement, HealthService, QuickAction, StatItem } from "@/types/residentDashboard";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { getTimeGreeting, summarizeResidentAppointments } from "@/utils/residentDashboard";

/** How many past visits the dashboard previews before "View All". */
const RECENT_APPOINTMENTS_LIMIT = 3;

/**
 * The Resident Dashboard's data and behaviour.
 *
 * Everything resident-specific comes from `GET /resident/dashboard`, which is
 * scoped to the bearer token — nothing here passes an id, so the screen cannot
 * be pointed at another resident. The quick actions, services and tip are UI
 * configuration rather than resident data, so they stay local.
 */
export const useResidentDashboard = () => {
  const router = useRouter();

  // The appointment history and the announcements already have their own
  // resident-scoped endpoints and hooks, so they are reused rather than
  // duplicated into the dashboard response.
  const appointmentsState = useResidentAppointments();
  const notificationsState = useNotifications();

  const [data, setData] = useState<ResidentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Guards a state write after the screen has gone away. */
  const mountedRef = useRef(true);
  const everLoadedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async (mode: "full" | "refresh" | "quiet") => {
    if (mode === "full") setLoading(true);
    if (mode === "refresh") setRefreshing(true);

    try {
      const next = await fetchResidentDashboard();
      if (!mountedRef.current) return;
      setData(next);
      setError(null);
      everLoadedRef.current = true;
    } catch (e: unknown) {
      if (!mountedRef.current) return;
      // A 401 is already handled centrally by the api interceptor, which ends
      // the session and routes back to sign-in; anything else is shown here.
      setError(getApiErrorMessage(e, "Unable to load your dashboard. Please try again."));
    } finally {
      if (!mountedRef.current) return;
      if (mode === "full") setLoading(false);
      if (mode === "refresh") setRefreshing(false);
    }
  }, []);

  // Refetch whenever the screen is focused, so booking an appointment or
  // reading an announcement is reflected on return without a manual refresh.
  // The first visit shows the skeleton; later ones update in place.
  useFocusEffect(
    useCallback(() => {
      void load(everLoadedRef.current ? "quiet" : "full");
    }, [load])
  );

  const go = useCallback(
    (href: string) => {
      router.push(href as never);
    },
    [router]
  );

  const handlers = useMemo(
    () => ({
      onViewAllAppointments: () => go("/resident/appointments"),
      onViewAppointment: () => go("/resident/appointments"),
      onQuickAction: (action: QuickAction) => go(action.href),
      onViewAllQuickActions: () => go("/resident/services"),
      onViewAllAnnouncements: () => go("/resident/announcements"),
      onAnnouncement: (_announcement: Announcement) => go("/resident/announcements"),
      onViewAllServices: () => go("/resident/services"),
      onService: (_service: HealthService) => go("/resident/services"),
      onHealthTipsSeeMore: () => go("/resident/announcements"),
      onLearnMore: () => go("/resident/services"),
    }),
    [go]
  );

  /**
   * The four cards, built from the server's counts.
   *
   * Falls back to zero rather than to a plausible-looking number: a resident
   * with no appointments must see 0, never a leftover sample figure.
   */
  const stats: StatItem[] = useMemo(() => {
    const s = data?.statistics;
    return [
      {
        id: "upcoming",
        label: "Upcoming Appointment",
        shortLabel: "Upcoming",
        value: s?.upcomingAppointments ?? 0,
        caption: "Next schedule",
        icon: "calendar-outline",
        tone: "blue",
      },
      {
        id: "completed",
        label: "Completed Visits",
        shortLabel: "Completed",
        value: s?.completedAppointments ?? 0,
        caption: "This year",
        icon: "checkmark",
        tone: "green",
      },
      {
        id: "records",
        label: "Health Records",
        shortLabel: "Records",
        value: s?.medicalRecords ?? 0,
        caption: "Available",
        icon: "document-text-outline",
        tone: "purple",
      },
      {
        id: "announcements",
        label: "Unread Announcements",
        shortLabel: "Announcements",
        value: s?.unreadAnnouncements ?? 0,
        caption: "New updates",
        icon: "notifications-outline",
        tone: "orange",
      },
    ];
  }, [data]);

  /**
   * The resident's recent visits.
   *
   * `summarizeResidentAppointments` is the project's existing definition of
   * what counts as a past appointment; reusing it keeps the dashboard and the
   * Records screen telling the same story.
   *
   * Capped here rather than inside the helper: the Records screen shares it and
   * shows a longer history, so trimming there would shorten that list too.
   * "View All" is the way to the rest.
   */
  const recentAppointments = useMemo(
    () =>
      summarizeResidentAppointments(
        appointmentsState.appointments,
        "#0B63F6"
      ).pastAppointments.slice(0, RECENT_APPOINTMENTS_LIMIT),
    [appointmentsState.appointments]
  );

  /**
   * Announcements.
   *
   * MaslogCare has no announcements collection — notifications are what the
   * barangay actually sends a resident, and they are already scoped to the
   * recipient, so they are what this section lists. Unread ones lead.
   */
  const announcements: Announcement[] = useMemo(
    () =>
      notificationsState.notifications.slice(0, 3).map((n) => ({
        id: n.id,
        title: n.title,
        date: n.time,
        detail: n.body,
        icon: n.isRead ? "document-text-outline" : "megaphone-outline",
        tone: n.isRead ? "purple" : "blue",
      })),
    [notificationsState.notifications]
  );

  return {
    /** "Resident" until the profile lands, never a sample name. */
    firstName: data?.resident.firstName || "Resident",
    profilePhoto: data?.resident.profilePhoto ?? null,
    greeting: getTimeGreeting(),
    stats,
    nextAppointment: data?.nextAppointment ?? null,
    recentAppointments,
    announcements,
    quickActions,
    healthServices,
    healthTip,
    loading,
    refreshing,
    error,
    reload: () => load("full"),
    refresh: async () => {
      // Pull-to-refresh updates every source the dashboard reads, not just the
      // counts, so the lists cannot lag behind the figures above them.
      await Promise.all([load("refresh"), notificationsState.refresh()]);
    },
    handlers,
  };
};

export type ResidentDashboardModel = ReturnType<typeof useResidentDashboard>;
