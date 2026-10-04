import { useCallback, useEffect, useRef, useState } from "react";
import { fetchSystemLogs, type SystemLog, type SystemLogsQuery } from "@/features/systemLogs/services/systemLogService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { useRealtimeRefetch } from "@/hooks/realtime/useRealtimeRefetch";

// Nearly every action writes a log, so a busy morning sends many; one reload a second is plenty.
const LIVE_INTERVAL_MS = 1000;

export interface UseSystemLogsReturn {
  logs: SystemLog[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  fetchLogs: (nextParams?: SystemLogsQuery, options?: { quiet?: boolean }) => Promise<void>;
  refreshLogs: () => Promise<void>;
  setPage: (nextPage: number) => void;
}

export const useSystemLogs = (initialParams: SystemLogsQuery = {}): UseSystemLogsReturn => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  // A fetch starts on mount, so the first paint is a loading state: never "no logs", and never a count of 0 that
  // would move a restored page back to page 1.
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(initialParams.page ?? 1);
  const [limit, setLimit] = useState(initialParams.limit ?? 25);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const latestRequestRef = useRef(0);
  const lastParamsRef = useRef<SystemLogsQuery>({ ...initialParams, page, limit });

  const fetchLogs = useCallback(async (nextParams: SystemLogsQuery = {}, { quiet = false }: { quiet?: boolean } = {}) => {
    const merged = {
      ...lastParamsRef.current,
      ...nextParams,
      page: nextParams.page ?? lastParamsRef.current.page ?? page,
      limit: nextParams.limit ?? lastParamsRef.current.limit ?? limit,
    };

    lastParamsRef.current = merged;
    if (merged.page) setPageState(merged.page);
    if (merged.limit) setLimit(merged.limit);

    // The newest request wins. Skipping one while another ran lost the new
    // entry (or the page) that asked for it.
    const requestId = ++latestRequestRef.current;
    const isLatest = () => requestId === latestRequestRef.current;

    if (!quiet) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await fetchSystemLogs(merged);
      if (!isLatest()) return;
      setLogs(response.logs ?? []);
      setTotal(response.total ?? 0);
      setTotalPages(response.totalPages ?? 1);
      setPageState(response.page ?? merged.page ?? 1);
      setLimit(response.limit ?? merged.limit ?? 25);
    } catch (err: unknown) {
      // A failed quiet reload keeps the table; the next new entry retries.
      if (isLatest() && !quiet) setError(getApiErrorMessage(err, "Unable to load system logs. Please try again."));
    } finally {
      if (isLatest()) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [limit, page]);

  const refreshLogs = useCallback(async () => {
    setRefreshing(true);
    await fetchLogs({ ...lastParamsRef.current, page: lastParamsRef.current.page ?? 1 });
  }, [fetchLogs]);

  useEffect(() => {
    void fetchLogs(initialParams);
  }, [fetchLogs, initialParams]);

  // New entries appear while the newest page is open; a deeper page is left
  // still, so the rows someone is reading do not shift under them.
  useRealtimeRefetch(
    ["systemLog"],
    () => ((lastParamsRef.current.page ?? 1) === 1 ? fetchLogs({}, { quiet: true }) : undefined),
    { intervalMs: LIVE_INTERVAL_MS }
  );

  return {
    logs,
    loading,
    refreshing,
    error,
    page,
    limit,
    total,
    totalPages,
    fetchLogs,
    refreshLogs,
    setPage: (nextPage: number) => {
      void fetchLogs({ ...lastParamsRef.current, page: nextPage });
    },
  };
};
