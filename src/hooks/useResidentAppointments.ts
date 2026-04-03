import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchMyAppointments, type AppointmentRecord } from "@/services/appointments";

const POLL_MS = 90_000;

export function useResidentAppointments() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const everLoadedRef = useRef(false);

  const load = useCallback(async (mode: "full" | "quiet") => {
    if (mode === "full") setLoading(true);
    try {
      setError(null);
      const rows = await fetchMyAppointments();
      setAppointments(rows);
      everLoadedRef.current = true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load appointments";
      setError(msg);
      if (mode === "full") setAppointments([]);
    } finally {
      if (mode === "full") setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const mode = everLoadedRef.current ? "quiet" : "full";
      (async () => {
        if (mode === "full") setLoading(true);
        try {
          setError(null);
          const rows = await fetchMyAppointments();
          if (!cancelled) {
            setAppointments(rows);
            everLoadedRef.current = true;
          }
        } catch (e: unknown) {
          if (!cancelled) {
            const msg = e instanceof Error ? e.message : "Failed to load appointments";
            setError(msg);
            if (mode === "full") setAppointments([]);
          }
        } finally {
          if (!cancelled && mode === "full") setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  useEffect(() => {
    const id = setInterval(() => {
      void fetchMyAppointments()
        .then((rows) => setAppointments(rows))
        .catch(() => {});
    }, POLL_MS);
    return () => clearInterval(id);
  }, []);

  const refresh = useCallback(() => void load("full"), [load]);

  return { appointments, loading, error, refresh };
}
