import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  createResidentAppointment,
  fetchConsultationCategories,
  type ConsultationCategory,
} from "@/services/appointments";
import { SERVICE_TYPES } from "@/config/appointmentServices";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { formatRoleLabel } from "@/utils/roleLabel";
import type { SelectOption } from "../components/FormSelectField";
import { formatResidentReference } from "../components/ResidentInfoCard";

/** What the form can complain about before the request is sent. */
export type BookingErrors = {
  serviceType?: string;
  reason?: string;
  confirmed?: string;
};

/**
 * Who handles the service, said plainly under it.
 *
 * The resident never picks a role — the service decides it — so this is the
 * one place they are told which health worker their request is going to. The
 * role comes from the server catalogue, so the form states the routing rather
 * than guessing it.
 */
function withHandler(description?: string, queueRole?: string): string | undefined {
  const handler = formatRoleLabel(queueRole);
  if (!handler) return description;
  return description ? `${description} · Handled by ${handler}` : `Handled by ${handler}`;
}

/**
 * The resident's appointment request: the catalogue it picks from, the answers,
 * and the submit that puts it in the queue.
 *
 * Two steps over one piece of state — step 2 is a receipt for what step 1 sent,
 * so it reads the same values rather than being handed a response object.
 */
export function useAppointmentBooking(visible: boolean, onBooked?: () => void) {
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const [serviceType, setServiceType] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<BookingErrors>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resident = useMemo(
    () => ({
      name: user?.name || "—",
      residentId: formatResidentReference(user?.id),
      address: user?.address || "Not provided",
      phone: user?.phone || "Not provided",
      email: user?.email || "Not provided",
    }),
    [user]
  );

  const loadServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesError(null);
    try {
      const list = await fetchConsultationCategories();
      // The server owns the catalogue; anything it marks as not bookable by a
      // resident is dropped rather than shown and rejected on submit.
      setCategories(list.filter((category) => category.residentBookable !== false));
    } catch (error: unknown) {
      setCategories([]);
      setServicesError(getApiErrorMessage(error, "Unable to load services. Please try again."));
    } finally {
      setServicesLoading(false);
    }
  }, []);

  // Reset to a clean step 1 every time the form is opened, so a previous
  // request's answers are never pre-filled into a new one.
  useEffect(() => {
    if (!visible) return;
    setStep(1);
    setServiceType(null);
    setReason("");
    setNotes("");
    setConfirmed(false);
    setErrors({});
    setSubmitError(null);
    void loadServices();
  }, [visible, loadServices]);

  const serviceOptions: SelectOption[] = useMemo(
    () =>
      categories.length
        ? categories.map((category) => ({
            id: category.key,
            label: category.label,
            helper: withHandler(category.description, category.queueRole),
          }))
        : // Offline fallback: the same approved five, from the shared catalogue.
          SERVICE_TYPES.map((service) => ({
            id: service.id,
            label: service.label,
            helper: withHandler(service.description, service.queueRole),
          })),
    [categories]
  );

  const selectedService = serviceOptions.find((option) => option.id === serviceType) ?? null;
  const servicesUnavailable = !servicesLoading && serviceOptions.length === 0;

  const clearError = useCallback((field: keyof BookingErrors) => {
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }, []);

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
      setStep(2);
    } catch (error: unknown) {
      setSubmitError(
        getApiErrorMessage(error, "Could not submit your appointment request. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  }, [submitting, serviceType, reason, notes, confirmed, onBooked]);

  return {
    step,
    resident,
    serviceOptions,
    selectedService,
    servicesLoading,
    servicesError,
    servicesUnavailable,
    loadServices,
    serviceType,
    setServiceType,
    reason,
    setReason,
    notes,
    setNotes,
    confirmed,
    toggleConfirmed: () => setConfirmed((previous) => !previous),
    errors,
    clearError,
    submitting,
    submitError,
    submit,
    isComplete: Boolean(serviceType) && Boolean(reason.trim()) && confirmed,
  };
}

export type AppointmentBooking = ReturnType<typeof useAppointmentBooking>;
