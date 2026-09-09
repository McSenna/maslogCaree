import { useCallback, useEffect, useRef, useState } from "react";
import { fetchSystemLogs, type SystemLog, type SystemLogsQuery } from "@/services/systemLogService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export interface UseSystemLogsReturn {
  logs: SystemLog[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  fetchLogs: (nextParams?: SystemLogsQuery) => Promise<void>;
  refreshLogs: () => Promise<void>;
  setPage: (nextPage: number) => void;
}

export function useSystemLogs(initialParams: SystemLogsQuery = {}): UseSystemLogsReturn {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(initialParams.page ?? 1);
  const [limit, setLimit] = useState(initialParams.limit ?? 25);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const requestRef = useRef<Promise<void> | null>(null);
  const lastParamsRef = useRef<SystemLogsQuery>({ ...initialParams, page, limit });

  const fetchLogs = useCallback(async (nextParams: SystemLogsQuery = {}) => {
    const merged = {
      ...lastParamsRef.current,
      ...nextParams,
      page: nextParams.page ?? lastParamsRef.current.page ?? page,
      limit: nextParams.limit ?? lastParamsRef.current.limit ?? limit,
    };

    lastParamsRef.current = merged;
    if (merged.page) setPageState(merged.page);
    if (merged.limit) setLimit(merged.limit);

    if (requestRef.current) return;

    setLoading(true);
    setError(null);

    const request = (async () => {
      const response = await fetchSystemLogs(merged);
      setLogs(response.logs ?? []);
      setTotal(response.total ?? 0);
      setTotalPages(response.totalPages ?? 1);
      setPageState(response.page ?? merged.page ?? 1);
      setLimit(response.limit ?? merged.limit ?? 25);
    })();

    requestRef.current = request;

    try {
      await request;
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Unable to load system logs. Please try again."));
    } finally {
      requestRef.current = null;
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit, page]);

  const refreshLogs = useCallback(async () => {
    setRefreshing(true);
    await fetchLogs({ ...lastParamsRef.current, page: lastParamsRef.current.page ?? 1 });
  }, [fetchLogs]);

  useEffect(() => {
    void fetchLogs(initialParams);
  }, [fetchLogs, initialParams]);

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
}
