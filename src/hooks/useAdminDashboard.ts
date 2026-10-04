import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchAdminDashboard,
  type AdminDashboardData,
  type AdminDashboardQuery,
} from "@/services/adminDashboardService";
import { NEWEST_ACCOUNTS_LIMIT } from "@/features/adminDashboard/utils/newestAccounts";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { toastBackgroundError } from "@/utils/errorToast/toastError";

export interface UseAdminDashboardReturn {
  data: AdminDashboardData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
  /** A quiet background update: no spinner, and a failure keeps the current data. */
  poll: () => Promise<void>;
}

// The "Newest accounts" card shows five per filter; the server sends that many for each.
const DEFAULT_QUERY: AdminDashboardQuery = { usersLimit: NEWEST_ACCOUNTS_LIMIT, activitiesLimit: 20 };

type LoadMode = "initial" | "refresh" | "silent";

export const useAdminDashboard = (
  query: AdminDashboardQuery = DEFAULT_QUERY
): UseAdminDashboardReturn => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latestLoadRef = useRef(0);
  const queryRef = useRef(query);

  const load = useCallback(async (mode: LoadMode) => {
    // The newest load wins. Skipping a load while another ran lost changes:
    // the running request could have read the data before the change that asked.
    const loadId = ++latestLoadRef.current;
    const isLatest = () => loadId === latestLoadRef.current;

    if (mode === "refresh") setRefreshing(true);
    if (mode === "initial") setLoading(true);
    if (mode !== "silent") setError(null);

    try {
      const next = await fetchAdminDashboard(queryRef.current);
      if (!isLatest()) return;
      setData(next);
      if (mode === "silent") setError(null);
    } catch (e: unknown) {
      if (!isLatest()) return;
      // A failed background update keeps what is on screen and says it may be
      // behind, at most once a minute, instead of a banner on every change.
      if (mode === "silent") toastBackgroundError("Dashboard not updated", e);
      else setError(getApiErrorMessage(e, "Unable to load dashboard data."));
    } finally {
      // A refresh overtaken by a live reload keeps its spinner until the newer data lands.
      if (isLatest()) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  const reload = useCallback(() => load("initial"), [load]);
  const refresh = useCallback(() => load("refresh"), [load]);
  const poll = useCallback(() => load("silent"), [load]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    void load("initial");
  }, [load]);

  return { data, loading, refreshing, error, reload, refresh, poll };
};
