import { useCallback } from "react";

import { useRealtimeCollection } from "@/hooks/realtime/useRealtimeCollection";
import { fetchMyAppointments, type AppointmentRecord } from "@/services/appointments";

// The order GET /appointments/me returns: newest booking first.
const newestFirst = (a: AppointmentRecord, b: AppointmentRecord) =>
  new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();

/**
 * The signed-in resident's appointments, kept current over the realtime
 * connection (staff confirming, rescheduling or completing a visit shows up at
 * once) instead of the 90-second poll this used to run.
 */
export const useResidentAppointments = () => {
  const fetchAppointments = useCallback(() => fetchMyAppointments(), []);
  const { items, loading, error, refresh, revalidate, applyLocal } = useRealtimeCollection("myAppointment", fetchAppointments, {
    sort: newestFirst,
    errorMessage: "Unable to load your appointments.",
  });

  return { appointments: items, loading, error, refresh, revalidate, applyLocal };
};
