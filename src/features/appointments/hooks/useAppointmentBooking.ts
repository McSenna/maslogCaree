import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";
import { formatResidentReference } from "../components/ResidentInfoCard";
import { buildServiceOptions } from "./booking/bookingServiceOptions";
import type { BookingErrors } from "./booking/bookingTypes";
import { useBookingServices } from "./booking/useBookingServices";
import { useBookingSubmit } from "./booking/useBookingSubmit";

export type { BookingErrors } from "./booking/bookingTypes";

export const useAppointmentBooking = (visible: boolean, onBooked?: () => void) => {
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const { categories, servicesLoading, servicesError, loadServices } = useBookingServices();

  const [serviceType, setServiceType] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<BookingErrors>({});

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

  // Start each booking from a clean slate.
  useSyncOnChange([visible], () => {
    if (!visible) return;
    setStep(1);
    setServiceType(null);
    setReason("");
    setNotes("");
    setConfirmed(false);
    setErrors({});
  });

  useEffect(() => {
    if (!visible) return;
    void loadServices();
  }, [visible, loadServices]);

  const serviceOptions = useMemo(() => buildServiceOptions(categories), [categories]);

  const selectedService = serviceOptions.find((option) => option.id === serviceType) ?? null;
  const servicesUnavailable = !servicesLoading && serviceOptions.length === 0;

  const clearError = useCallback((field: keyof BookingErrors) => {
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }, []);

  const { submitting, submitError, submit } = useBookingSubmit({
    serviceType,
    reason,
    notes,
    confirmed,
    onBooked,
    setErrors,
    onSubmitted: () => setStep(2),
  });

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
};

export type AppointmentBooking = ReturnType<typeof useAppointmentBooking>;
