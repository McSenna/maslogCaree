import { useCallback, useEffect, useState } from "react";

import { fetchRegularRescheduleOptions, rescheduleAppointment } from "@/services/appointmentActionsApi";
import type { AppointmentRecord } from "@/types/appointments.types";
import { getApiErrorMessage, isConflictError } from "@/utils/apiErrorHandler";
import { toastError } from "@/utils/errorToast/toastError";

import { useRegularSchedule } from "../regularSchedule/useRegularSchedule";
import { isSameInstant } from "./rescheduleSelection";
import type { RescheduleStep } from "./useRescheduleAppointment";

const SLOT_TAKEN_MESSAGE = "That time was just booked by someone else. Please pick another time.";

/**
 * Moving a BP checking visit: pick a date and time on its own calendar, confirm,
 * then save. The server re-checks the time under the day's lock, so a time
 * taken in the meantime sends the resident back to freshly loaded times.
 */
export const useRegularReschedule = (appointment: AppointmentRecord, onSuccess: (appointment: AppointmentRecord) => void) => {
  const picker = useRegularSchedule(fetchRegularRescheduleOptions);
  const [step, setStep] = useState<RescheduleStep>("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { activate, discardPending } = picker;
  const appointmentId = appointment._id;

  useEffect(() => {
    // The first load starts when the dialog opens; state settles when it resolves.
    activate(appointmentId);
    return discardPending;
  }, [activate, discardPending, appointmentId]);

  const isCurrentSlot = isSameInstant(picker.slotStart, appointment.slotStart);

  const submit = useCallback(async () => {
    const { dateKey, slotStart } = picker;
    if (!dateKey || !slotStart || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      onSuccess(await rescheduleAppointment(appointmentId, { appointmentDate: dateKey, slotStart }));
    } catch (caught: unknown) {
      toastError("Appointment not rescheduled", caught, { inline: true });
      if (isConflictError(caught)) {
        setStep("select");
        setSubmitError(getApiErrorMessage(caught, SLOT_TAKEN_MESSAGE));
        picker.reloadAfterRefusal();
      } else {
        setSubmitError(getApiErrorMessage(caught, "Unable to reschedule this appointment."));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [appointmentId, isSubmitting, onSuccess, picker]);

  return {
    picker,
    step,
    isSubmitting,
    submitError,
    isCurrentSlot,
    clearError: () => setSubmitError(null),
    goToConfirm: () => setStep("confirm"),
    goToSelect: () => setStep("select"),
    submit,
  };
};
