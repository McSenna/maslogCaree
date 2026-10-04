import { useCallback, useEffect, useMemo, useState } from "react";
import { BHW_QUEUE_SERVICE_KEY } from "@/config/healthcareRoles";
import { useAppointmentCompletion } from "@/hooks/useAppointmentCompletion";
import { useQueueDashboard } from "@/hooks/useQueueDashboard";
import {
  fetchConsultationCategories,
  type ConsultationCategory,
} from "@/services/appointments";
import { reportError } from "@/utils/errorReporting";

const FALLBACK_SERVICE_LABEL = "BP Checking";

export const useBhwQueue = () => {
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);

  const dashboard = useQueueDashboard({ categoryKey: BHW_QUEUE_SERVICE_KEY });

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await fetchConsultationCategories());
    } catch (error: unknown) {
      // The fallback label still names the service, so this stays off screen.
      reportError("BHW service categories not loaded", error);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    void loadCategories();
  }, [loadCategories]);

  const service = useMemo(
    () => categories.find((category) => category.key === BHW_QUEUE_SERVICE_KEY) ?? null,
    [categories]
  );

  const serviceLabel = service?.label ?? FALLBACK_SERVICE_LABEL;

  const serviceLabels = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.key, category.label])),
    [categories]
  );

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  const completion = useAppointmentCompletion({
    onCompleted: async () => {
      await dashboard.refreshAll();
    },
  });

  const { loadOverview, loadQueue, loadStatusList, activeStatus } = dashboard;
  const refreshAll = useCallback(() => {
    void loadCategories();
    void loadOverview();
    void loadQueue();
    void loadStatusList(activeStatus);
  }, [loadCategories, loadOverview, loadQueue, loadStatusList, activeStatus]);

  return {
    dashboard,
    completion,
    serviceLabel,
    serviceLabels,
    todayLabel,
    refreshAll,
    busy: dashboard.overviewLoading || dashboard.listLoading || dashboard.queueLoading,
    scopeDescription: service?.description
      ? `${serviceLabel}: ${service.description}`
      : `${serviceLabel} requests assigned to you.`,
    emptyMessage: `No ${serviceLabel} appointments to show.`,
  };
};
