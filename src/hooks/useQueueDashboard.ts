import { useCallback, useEffect, useRef, useState } from "react";
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
import { REFRESH_FAILED, toastError } from "@/utils/errorToast/toastError";
import { sortQueueBySlot } from "@/utils/queueOrder";
import { useRealtimeRefetch } from "@/hooks/realtime/useRealtimeRefetch";

// The server orders the queue by triage priority and slot, so changes reload it rather than patch it.
const QUEUE_SOURCES = ["appointment", "missionSchedule"] as const;

type QueueScope = {
  categoryKey?: string;
};

export const useQueueDashboard = (scope: QueueScope = {}) => {
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

  const overviewLoaded = useRef(false);
  const listLoadedFor = useRef<AppointmentStatus | null>(null);
  const queueLoaded = useRef(false);
  // Saves and realtime both reload these views and the calls overlap: only the newest may write.
  const latestOverview = useRef(0);
  const latestList = useRef(0);
  const latestQueue = useRef(0);

  useEffect(() => {
    overviewLoaded.current = false;
    listLoadedFor.current = null;
    queueLoaded.current = false;
  }, [categoryKey]);

  const loadOverview = useCallback(async () => {
    const loadId = ++latestOverview.current;
    if (!overviewLoaded.current) setOverviewLoading(true);
    try {
      const next = await fetchQueueOverview({ categoryKey });
      if (loadId !== latestOverview.current) return;
      setOverview(next);
      overviewLoaded.current = true;
    } catch {
      if (loadId === latestOverview.current && !overviewLoaded.current) setOverview(null);
    } finally {
      if (loadId === latestOverview.current) setOverviewLoading(false);
    }
  }, [categoryKey]);

  const loadStatusList = useCallback(
    async (status: AppointmentStatus) => {
      const loadId = ++latestList.current;
      const refreshing = listLoadedFor.current === status;
      if (!refreshing) setListLoading(true);
      setListError(null);
      try {
        const rows =
          status === "completed"
            ? await fetchCompletedAppointments({ categoryKey })
            : await fetchAppointmentsByStatus(status, { categoryKey });
        if (loadId !== latestList.current) return;
        setStatusList(rows);
        listLoadedFor.current = status;
      } catch (error: unknown) {
        if (loadId !== latestList.current) return;
        const message = getApiErrorMessage(error, "The appointment list could not be loaded.");
        if (refreshing) {
          toastError("Unable to refresh appointments", error, { reason: REFRESH_FAILED });
        } else {
          setStatusList([]);
          setListError(message);
        }
      } finally {
        if (loadId === latestList.current) setListLoading(false);
      }
    },
    [categoryKey]
  );

  const loadQueue = useCallback(async () => {
    const loadId = ++latestQueue.current;
    const refreshing = queueLoaded.current;
    if (!refreshing) setQueueLoading(true);
    setQueueError(null);
    try {
      const lists = await Promise.all(
        ACTIVE_QUEUE_STATUSES.map((status) => fetchAppointmentsByStatus(status, { categoryKey }))
      );
      if (loadId !== latestQueue.current) return;
      setQueue(sortQueueBySlot(lists.flat()));
      queueLoaded.current = true;
    } catch (error: unknown) {
      if (loadId !== latestQueue.current) return;
      if (refreshing) {
        toastError("Unable to refresh the queue", error, { reason: REFRESH_FAILED });
      } else {
        setQueue([]);
        setQueueError(getApiErrorMessage(error, "The queue could not be loaded."));
      }
    } finally {
      if (loadId === latestQueue.current) setQueueLoading(false);
    }
  }, [categoryKey]);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadOverview(), loadStatusList(activeStatus), loadQueue()]);
  }, [loadOverview, loadStatusList, activeStatus, loadQueue]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    void loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    void loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    void loadStatusList(activeStatus);
  }, [activeStatus, loadStatusList]);

  useRealtimeRefetch(QUEUE_SOURCES, refreshAll);

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
};
