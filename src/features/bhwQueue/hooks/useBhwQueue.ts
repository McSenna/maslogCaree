import { useCallback, useEffect, useMemo, useState } from "react";
import { BHW_QUEUE_SERVICE_KEY } from "@/config/healthcareRoles";
import { useAppointmentCompletion } from "@/hooks/useAppointmentCompletion";
import { useQueueDashboard } from "@/hooks/useQueueDashboard";
import {
  fetchConsultationCategories,
  type ConsultationCategory,
} from "@/services/appointments";

/** The label to show before the catalogue has been read. */
const FALLBACK_SERVICE_LABEL = "BP Checking";

/**
 * The BHW's queue: the shared dashboard reads, narrowed to BP Checking, plus
 * the catalogue entry that names the service.
 */
export function useBhwQueue() {
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);

  const dashboard = useQueueDashboard({ categoryKey: BHW_QUEUE_SERVICE_KEY });

  /**
   * The catalogue, for names and the stated duration.
   *
   * Its own request, and its own failure: the label falling back to "BP
   * Checking" is a much smaller loss than the queue itself not loading, so a
   * catalogue that does not answer must not take the appointments down with it.
   */
  const loadCategories = useCallback(async () => {
    try {
      setCategories(await fetchConsultationCategories());
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  /** The service's entry in the catalogue, once it has been read. */
  const service = useMemo(
    () => categories.find((category) => category.key === BHW_QUEUE_SERVICE_KEY) ?? null,
    [categories]
  );

  const serviceLabel = service?.label ?? FALLBACK_SERVICE_LABEL;

  /**
   * Service key → display name, for the panels that render a service column.
   *
   * Built from the whole catalogue rather than the single row: a record that
   * predates a routing change still names its own service instead of falling
   * back to a raw key.
   */
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

  /**
   * After a completion: the patient leaves the queue and appears under
   * Completed, and the header figures move. Everything is revalidated from the
   * server rather than patched locally — the counts are computed there, and a
   * client that recomputed them would be guessing at the same numbers.
   */
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
    /** What the screen covers, in the catalogue's own words where it has them. */
    scopeDescription: service?.description
      ? `${serviceLabel} — ${service.description}`
      : `${serviceLabel} requests assigned to you.`,
    emptyMessage: `No ${serviceLabel} appointments to show.`,
  };
}
