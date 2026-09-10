import { useCallback, useEffect, useState } from "react";
import {
  fetchAppointmentsByStatus,
  fetchQueueOverview,
  type AppointmentRecord,
  type QueueOverview,
} from "@/services/appointments";
import { fetchCompletedAppointments } from "@/services/medicalRecords";
import {
  ACTIVE_QUEUE_STATUSES,
  type AppointmentStatus,
} from "@/components/appointmentQueue/queueTheme";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { sortQueueBySlot } from "@/utils/queueOrder";

type QueueScope = {
  /**
   * Narrows to one service within the role's own scope.
   *
   * Belt and braces: the server already scopes a role to the services it owns
   * and intersects any `categoryKey` with that scope, so passing it states a
   * single-service screen's intent without widening what it can reach.
   */
  categoryKey?: string;
};

/**
 * The three server reads behind an Appointment & Queue screen: the header
 * figures, the tabbed appointment list, and the active queue.
 *
 * Shared by the mission-control screen, which covers every service its role
 * owns, and the BHW screen, which covers exactly one. They differ only in the
 * scope passed here, so they run the same loaders rather than two copies that
 * would drift.
 *
 * The reads are grouped because every write on either screen invalidates all
 * three at once — scheduling a patient moves a figure, empties a row from
 * Pending and adds one to the queue — so callers refresh them together through
 * `refreshAll` rather than tracking which panels an action touched.
 */
export function useQueueDashboard(scope: QueueScope = {}) {
  const { categoryKey } = scope;

  const [overview, setOverview] = useState<QueueOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  const [activeStatus, setActiveStatus] = useState<AppointmentStatus>("pending");
  const [statusList, setStatusList] = useState<AppointmentRecord[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [queue, setQueue] = useState<AppointmentRecord[]>([]);
  const [queueLoading, setQueueLoading] = useState(true);
  const [queueError, setQueueError] = useState<string | null>(null);

  /**
   * The header figures, today's schedule and the breakdown.
   *
   * One request, all of it counted server-side against this role's own
   * services — the client never sees another queue's records to filter out.
   */
  const loadOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      setOverview(await fetchQueueOverview({ categoryKey }));
    } catch {
      // The panels fall back to their empty states; the appointments list
      // carries the visible error so the screen reports one problem, not three.
      setOverview(null);
    } finally {
      setOverviewLoading(false);
    }
  }, [categoryKey]);

  /**
   * The table's rows for whichever tab is selected.
   *
   * Completed reads its own endpoint rather than `?status=completed`: those
   * rows are read for who closed them and what record came out, which the
   * scheduling list does not carry.
   */
  const loadStatusList = useCallback(
    async (status: AppointmentStatus) => {
      setListLoading(true);
      setListError(null);
      try {
        setStatusList(
          status === "completed"
            ? await fetchCompletedAppointments({ categoryKey })
            : await fetchAppointmentsByStatus(status, { categoryKey })
        );
      } catch (error: unknown) {
        setStatusList([]);
        setListError(getApiErrorMessage(error, "The appointment list could not be loaded."));
      } finally {
        setListLoading(false);
      }
    },
    [categoryKey]
  );

  /**
   * The active queue: everything approved or being served, in slot order.
   *
   * Merged from the three statuses the server lists separately and sorted by
   * start time here — the order a clinician works in is the order patients
   * were booked for, not the order the statuses came back.
   */
  const loadQueue = useCallback(async () => {
    setQueueLoading(true);
    setQueueError(null);
    try {
      const lists = await Promise.all(
        ACTIVE_QUEUE_STATUSES.map((status) => fetchAppointmentsByStatus(status, { categoryKey }))
      );
      setQueue(sortQueueBySlot(lists.flat()));
    } catch (error: unknown) {
      setQueue([]);
      setQueueError(getApiErrorMessage(error, "The queue could not be loaded."));
    } finally {
      setQueueLoading(false);
    }
  }, [categoryKey]);

  /** Re-reads everything the dashboard shows, after an appointment changes. */
  const refreshAll = useCallback(async () => {
    await Promise.all([loadOverview(), loadStatusList(activeStatus), loadQueue()]);
  }, [loadOverview, loadStatusList, activeStatus, loadQueue]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    void loadStatusList(activeStatus);
  }, [activeStatus, loadStatusList]);

  return {
    overview,
    overviewLoading,
    activeStatus,
    setActiveStatus,
    statusList,
    listLoading,
    listError,
    queue,
    queueLoading,
    queueError,
    loadQueue,
    loadOverview,
    loadStatusList,
    refreshAll,
  };
}
