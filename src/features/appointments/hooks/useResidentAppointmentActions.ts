import { useCallback, useState } from "react";

import { notifyToast } from "@/components/feedback/toast/toastStore";
import { cancelAppointment } from "@/services/appointmentActionsApi";
import type { AppointmentRecord } from "@/types/appointments.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

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
        notifyToast("Appointment cancelled");
        await refresh();
      } catch (e: unknown) {
        setCancelError(getApiErrorMessage(e, "Unable to cancel appointment."));
      } finally {
        setIsCancelling(false);
      }
    },
    [cancelTarget, isCancelling, refresh]
  );

  const confirmReschedule = useCallback(async () => {
    setRescheduleTarget(null);
    notifyToast("Appointment rescheduled");
    await refresh();
  }, [refresh]);

  return {
    rescheduleTarget,
    startReschedule: setRescheduleTarget,
    closeReschedule: () => setRescheduleTarget(null),
    confirmReschedule,
    cancelTarget,
    startCancel: setCancelTarget,
    closeCancel,
    confirmCancel,
    isCancelling,
    cancelError,
  };
};
