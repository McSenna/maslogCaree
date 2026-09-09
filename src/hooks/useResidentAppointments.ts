import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchMyAppointments, type AppointmentRecord } from "@/services/appointments";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

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
      setError(getApiErrorMessage(e, "Unable to load your appointments."));
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
            setError(getApiErrorMessage(e, "Unable to load your appointments."));
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
        .then((rows) => {
          setAppointments(rows);
          setError(null);
        })
        .catch((e: unknown) => {
          // A background refresh must not replace what is on screen, but the
          // failure is still surfaced rather than silently discarded.
          setError(getApiErrorMessage(e, "Unable to refresh your appointments."));
        });
    }, POLL_MS);
    return () => clearInterval(id);
  }, []);

  const refresh = useCallback(() => void load("full"), [load]);

  return { appointments, loading, error, refresh };
}
