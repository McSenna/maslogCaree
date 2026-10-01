import { useCallback, useRef, useState } from "react";
import { toast } from "@/components/feedback/toast/toastStore";
import { createResidentAppointment, type AppointmentRecord } from "@/services/appointments";
import { getApiErrorMessage, normalizeApiError } from "@/utils/apiErrorHandler";
import { createBookingRequestKey } from "./bookingRules";
import { classifyDraftFailure, draftBody, validateDraft, type BookingDraft } from "./bookingDraft";
import type { BookingErrors } from "./bookingTypes";

const CONNECTION_MESSAGE =
  "We could not reach the health center, so your booking may not have gone through. Your details are kept. Tap Book appointment again; you will not be booked twice.";
const FALLBACK_MESSAGE = "We could not book your appointment. Check your details, then try again.";

/**
 * Sends the booking and reports what happened. Every field the resident typed
 * stays as it was on failure. One request key covers every retry of this form,
 * so a request that timed out after the server saved it cannot book twice.
 */
export const useBookingSubmit = ({
  draft,
  onBooked,
  setErrors,
  onSlotRefused,
}: {
  draft: BookingDraft;
  onBooked: (appointment: AppointmentRecord) => void;
  setErrors: (errors: BookingErrors) => void;
  onSlotRefused: () => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const requestKey = useRef<string | null>(null);

  /** Event handlers only: a new form gets a new key. */
  const startNewAttempt = useCallback(() => {
    requestKey.current = null;
  }, []);

  const submit = useCallback(async () => {
    if (inFlight.current) return;

    const found = validateDraft(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setSubmitError("Some details are missing. Check the highlighted fields.");
      return;
    }

    inFlight.current = true;
    requestKey.current ??= createBookingRequestKey();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { appointment } = await createResidentAppointment(draftBody(draft, requestKey.current));
      onBooked(appointment);
    } catch (error: unknown) {
      const failure = classifyDraftFailure(draft, normalizeApiError(error));
      if (failure === "slot_unavailable") {
        setErrors({ slot: draft.weekly ? "Choose another Wednesday." : "Choose another time." });
        onSlotRefused();
      }
      setSubmitError(failure === "connection" ? CONNECTION_MESSAGE : getApiErrorMessage(error, FALLBACK_MESSAGE));
      toast.error("Appointment not booked");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }, [draft, onBooked, setErrors, onSlotRefused]);

  return { submitting, submitError, setSubmitError, submit, startNewAttempt };
};
