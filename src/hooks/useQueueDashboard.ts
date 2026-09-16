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

  const loadOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      setOverview(await fetchQueueOverview({ categoryKey }));
    } catch {
      setOverview(null);
    } finally {
      setOverviewLoading(false);
    }
  }, [categoryKey]);

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
};
