import { useCallback, useState } from "react";
import { createResidentAppointment } from "@/services/appointments";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import type { BookingErrors } from "./bookingTypes";

export const useBookingSubmit = ({
  serviceType,
  reason,
  notes,
  confirmed,
  onBooked,
  setErrors,
  onSubmitted,
}: {
  serviceType: string | null;
  reason: string;
  notes: string;
  confirmed: boolean;
  onBooked?: () => void;
  setErrors: (errors: BookingErrors) => void;
  onSubmitted: () => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = useCallback(async () => {
    if (submitting) return;

    const found: BookingErrors = {};
    if (!serviceType) found.serviceType = "Please select a service type.";
    if (!reason.trim()) found.reason = "Please describe your reason for visit or symptoms.";
    if (!confirmed) found.confirmed = "Please confirm that the appointment details are correct.";

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await createResidentAppointment({
        consultationType: serviceType as string,
        description: reason.trim(),
        additionalNotes: notes.trim(),
      });
      onBooked?.();
      onSubmitted();
    } catch (error: unknown) {
      setSubmitError(
        getApiErrorMessage(error, "Could not submit your appointment request. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  }, [submitting, serviceType, reason, notes, confirmed, onBooked, setErrors, onSubmitted]);

  return { submitting, submitError, setSubmitError, submit };
};
