import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchMyAppointments, type AppointmentRecord } from "@/services/appointments";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

const POLL_MS = 90_000;

export const useResidentAppointments = () => {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const everLoaded = useRef(false);
  const mounted = useRef(true);
  const inFlight = useRef(false);

  const load = useCallback(async (showSpinner: boolean) => {
    if (inFlight.current && !showSpinner) return;

    inFlight.current = true;
    if (showSpinner) setLoading(true);

    try {
      const rows = await fetchMyAppointments();
      if (!mounted.current) return;
      setAppointments(rows);
      setError(null);
      everLoaded.current = true;
    } catch (e: unknown) {
      if (!mounted.current) return;
      setError(getApiErrorMessage(e, "Unable to load your appointments."));
      if (showSpinner) setAppointments([]);
    } finally {
      inFlight.current = false;
      if (mounted.current && showSpinner) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      mounted.current = true;
      void load(!everLoaded.current);

      const id = setInterval(() => void load(false), POLL_MS);

      return () => {
        mounted.current = false;
        clearInterval(id);
      };
    }, [load])
  );

  const refresh = useCallback(() => load(true), [load]);

  return { appointments, loading, error, refresh };
};
