import { useCallback, useEffect, useState } from "react";
import { fetchSystemLogStats, type SystemLogStatsResponse } from "@/services/systemLogService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export function useSystemLogStats() {
  const [stats, setStats] = useState<SystemLogStatsResponse["stats"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSystemLogStats();
      setStats(response.stats);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Unable to load log summary."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { stats, loading, error, reload: load };
}
