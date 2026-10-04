import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  fetchStaffDashboard,
  type StaffDashboardData,
} from "@/services/staffDashboardService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { useRealtimeRefetch } from "@/hooks/realtime/useRealtimeRefetch";

// Everything the staff dashboard's cards and lists are computed from.
const DASHBOARD_SOURCES = ["appointment", "medicalRecord", "missionSchedule", "inventoryItem"] as const;

export interface UseStaffDashboardReturn {
  data: StaffDashboardData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useStaffDashboard = (): UseStaffDashboardReturn => {
  const [data, setData] = useState<StaffDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latestLoadRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async (mode: "initial" | "refresh" | "silent") => {
    // The newest load wins. Skipping a load while another ran lost changes:
    // the running request could have read the data before the change that asked.
    const loadId = ++latestLoadRef.current;
    const isLatest = () => mountedRef.current && loadId === latestLoadRef.current;

    if (mode === "refresh") setRefreshing(true);
    if (mode === "initial") setLoading(true);
    setError(null);

    try {
      const next = await fetchStaffDashboard();
      if (isLatest()) setData(next);
    } catch (e: unknown) {
      if (isLatest()) setError(getApiErrorMessage(e, "Unable to load dashboard information."));
    } finally {
      if (isLatest()) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  const reload = useCallback(() => load("initial"), [load]);
  const refresh = useCallback(() => load("refresh"), [load]);

  const everLoadedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      void load(everLoadedRef.current ? "refresh" : "initial").then(() => {
        everLoadedRef.current = true;
      });
    }, [load])
  );

  // Realtime changes reload quietly: no spinner while someone reads the numbers.
  useRealtimeRefetch(DASHBOARD_SOURCES, () => load("silent"));

  return { data, loading, refreshing, error, reload, refresh };
};
