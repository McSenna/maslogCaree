import { useCallback, useEffect, useState } from "react";
import { fetchSystemLogStats, type SystemLogStatsResponse } from "@/features/systemLogs/services/systemLogService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { useRealtimeRefetch } from "@/hooks/realtime/useRealtimeRefetch";

export const useSystemLogStats = () => {
  const [stats, setStats] = useState<SystemLogStatsResponse["stats"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) {
      setLoading(true);
      setError(null);
    }
    try {
      const response = await fetchSystemLogStats();
      setStats(response.stats);
    } catch (err: unknown) {
      if (!quiet) setError(getApiErrorMessage(err, "Unable to load log summary."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    void load();
  }, [load]);

  // The counts follow new entries without flashing the cards.
  useRealtimeRefetch(["systemLog"], () => load(true), { intervalMs: 1000 });

  return { stats, loading, error, reload: () => load() };
};
