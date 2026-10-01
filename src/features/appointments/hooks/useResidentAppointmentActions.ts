import { useCallback, useState } from "react";

import { toast } from "@/components/feedback/toast/toastStore";
import { cancelAppointment } from "@/services/appointmentActionsApi";
import type { AppointmentRecord } from "@/types/appointments.types";
import { getApiErrorMessage, isConflictError } from "@/utils/apiErrorHandler";

/**
 * Drives the resident's reschedule and cancel overlays: which appointment is
 * targeted, the in-flight guard that stops double submissions, and the refresh
 * + toast that follow a successful change.
 */
export const useResidentAppointmentActions = (refresh: () => Promise<void> | void) => {

  const [rescheduleTarget, setRescheduleTarget] = useState<AppointmentRecord | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AppointmentRecord | null>(null);

  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const closeCancel = useCallback(() => {
    if (isCancelling) return;
    setCancelTarget(null);
    setCancelError(null);
  }, [isCancelling]);

  const confirmCancel = useCallback(
    async (reason: string) => {
      if (!cancelTarget || isCancelling) return;

      setIsCancelling(true);
      setCancelError(null);

      try {
        await cancelAppointment(cancelTarget._id, reason);
        setCancelTarget(null);
        toast.success("Appointment cancelled");
        await refresh();
      } catch (e: unknown) {
        // The reason stays in the cancel form; the toast marks the failed attempt.
        setCancelError(getApiErrorMessage(e, "Unable to cancel appointment."));
        toast.error("Appointment not cancelled");
        // A conflict means staff changed it meanwhile: resync the card behind the dialog.
        if (isConflictError(e)) void refresh();
      } finally {
        setIsCancelling(false);
      }
    },
    [cancelTarget, isCancelling, refresh]
  );

  // Closing can follow a refused attempt (slot taken, or the appointment changed
  // elsewhere), so the list quietly resyncs instead of waiting for the next poll.
  const closeReschedule = useCallback(() => {
    setRescheduleTarget(null);
    void refresh();
  }, [refresh]);

  const confirmReschedule = useCallback(async () => {
    setRescheduleTarget(null);
    toast.success("Appointment rescheduled");
    await refresh();
  }, [refresh]);

  return {
    rescheduleTarget,
    startReschedule: setRescheduleTarget,
    closeReschedule,
    confirmReschedule,
    cancelTarget,
    startCancel: setCancelTarget,
    closeCancel,
    confirmCancel,
    isCancelling,
    cancelError,
  };
};
