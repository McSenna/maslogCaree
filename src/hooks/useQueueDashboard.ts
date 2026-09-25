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
import { sortQueueBySlot } from "@/utils/queueOrder";
import { toast } from "@/components/feedback/toast/toastStore";

const REFRESH_FAILED = "Showing the last loaded data. Try again in a moment.";

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

  useEffect(() => {
    overviewLoaded.current = false;
    listLoadedFor.current = null;
    queueLoaded.current = false;
  }, [categoryKey]);

  const loadOverview = useCallback(async () => {
    if (!overviewLoaded.current) setOverviewLoading(true);
    try {
      setOverview(await fetchQueueOverview({ categoryKey }));
      overviewLoaded.current = true;
    } catch {
      if (!overviewLoaded.current) setOverview(null);
    } finally {
      setOverviewLoading(false);
    }
  }, [categoryKey]);

  const loadStatusList = useCallback(
    async (status: AppointmentStatus) => {
      const refreshing = listLoadedFor.current === status;
      if (!refreshing) setListLoading(true);
      setListError(null);
      try {
        setStatusList(
          status === "completed"
            ? await fetchCompletedAppointments({ categoryKey })
            : await fetchAppointmentsByStatus(status, { categoryKey })
        );
        listLoadedFor.current = status;
      } catch (error: unknown) {
        const message = getApiErrorMessage(error, "The appointment list could not be loaded.");
        if (refreshing) {
          toast.error("Unable to refresh appointments", REFRESH_FAILED);
        } else {
          setStatusList([]);
          setListError(message);
        }
      } finally {
        setListLoading(false);
      }
    },
    [categoryKey]
  );

  const loadQueue = useCallback(async () => {
    const refreshing = queueLoaded.current;
    if (!refreshing) setQueueLoading(true);
    setQueueError(null);
    try {
      const lists = await Promise.all(
        ACTIVE_QUEUE_STATUSES.map((status) => fetchAppointmentsByStatus(status, { categoryKey }))
      );
      setQueue(sortQueueBySlot(lists.flat()));
      queueLoaded.current = true;
    } catch (error: unknown) {
      if (refreshing) {
        toast.error("Unable to refresh the queue", REFRESH_FAILED);
      } else {
        setQueue([]);
        setQueueError(getApiErrorMessage(error, "The queue could not be loaded."));
      }
    } finally {
      setQueueLoading(false);
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
