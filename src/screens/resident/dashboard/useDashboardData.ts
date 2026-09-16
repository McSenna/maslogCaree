import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  fetchResidentDashboard,
  type ResidentDashboardData,
} from "@/services/residentDashboardService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export const useDashboardData = () => {
  const [data, setData] = useState<ResidentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const everLoadedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async (mode: "full" | "refresh" | "quiet") => {
    if (mode === "full") setLoading(true);
    if (mode === "refresh") setRefreshing(true);

    try {
      const next = await fetchResidentDashboard();
      if (!mountedRef.current) return;
      setData(next);
      setError(null);
      everLoadedRef.current = true;
    } catch (e: unknown) {
      if (!mountedRef.current) return;
      setError(getApiErrorMessage(e, "Unable to load your dashboard. Please try again."));
    } finally {
      if (!mountedRef.current) return;
      if (mode === "full") setLoading(false);
      if (mode === "refresh") setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load(everLoadedRef.current ? "quiet" : "full");
    }, [load])
  );

  return { data, loading, refreshing, error, load };
};
