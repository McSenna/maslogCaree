import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  fetchStaffDashboard,
  type StaffDashboardData,
} from "@/services/staffDashboardService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

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

  const inFlightRef = useRef<Promise<void> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async (mode: "initial" | "refresh") => {
    if (inFlightRef.current) return;

    if (mode === "refresh") setRefreshing(true);
    else setLoading(true);
    setError(null);

    const request = (async () => {
      try {
        const next = await fetchStaffDashboard();
        if (mountedRef.current) setData(next);
      } catch (e: unknown) {
        if (mountedRef.current) {
          setError(getApiErrorMessage(e, "Unable to load dashboard information."));
        }
      }
    })();

    inFlightRef.current = request;
    try {
      await request;
    } finally {
      inFlightRef.current = null;
      if (mountedRef.current) {
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

  return { data, loading, refreshing, error, reload, refresh };
};
