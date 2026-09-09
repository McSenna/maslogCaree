import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchAdminDashboard,
  type AdminDashboardData,
  type AdminDashboardQuery,
} from "@/services/adminDashboardService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export interface UseAdminDashboardReturn {
  data: AdminDashboardData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
}

const DEFAULT_QUERY: AdminDashboardQuery = { usersLimit: 5, activitiesLimit: 5 };

/**
 * Owns the single dashboard request.
 *
 * Mirrors useUsers: fetch once on mount, an in-flight guard so a retry tap or a
 * remount cannot fire duplicate requests, and refresh() kept separate from
 * reload() so pull-to-refresh does not swap the populated dashboard for
 * skeletons.
 */
export function useAdminDashboard(
  query: AdminDashboardQuery = DEFAULT_QUERY
): UseAdminDashboardReturn {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inFlightRef = useRef<Promise<void> | null>(null);
  // Held in a ref so a caller passing an inline object literal does not
  // re-trigger the mount effect on every render.
  const queryRef = useRef(query);

  const load = useCallback(async (mode: "initial" | "refresh") => {
    if (inFlightRef.current) return;

    if (mode === "refresh") setRefreshing(true);
    else setLoading(true);
    setError(null);

    const request = (async () => {
      try {
        setData(await fetchAdminDashboard(queryRef.current));
      } catch (e: unknown) {
        setError(getApiErrorMessage(e, "Unable to load dashboard data."));
      }
    })();

    inFlightRef.current = request;
    try {
      await request;
    } finally {
      inFlightRef.current = null;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const reload = useCallback(() => load("initial"), [load]);
  const refresh = useCallback(() => load("refresh"), [load]);

  useEffect(() => {
    void load("initial");
  }, [load]);

  return { data, loading, refreshing, error, reload, refresh };
}
