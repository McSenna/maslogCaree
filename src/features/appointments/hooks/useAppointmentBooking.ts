import { useCallback, useEffect, useMemo, useState } from "react";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";
import type { AppointmentRecord } from "@/services/appointments";
import { isWeeklyService } from "@/utils/serviceDays";
import { isDraftComplete, type BookingDraft } from "./booking/bookingDraft";
import { buildServiceOptions } from "./booking/bookingServiceOptions";
import type { BookingErrors } from "./booking/bookingTypes";
import { useBookingResident } from "./booking/useBookingResident";
import { useBookingServices } from "./booking/useBookingServices";
import { useBookingSlots } from "./booking/useBookingSlots";
import { useBookingSubmit } from "./booking/useBookingSubmit";
import { useWeeklyBookingDays } from "./booking/useWeeklyBookingDays";

export type { BookingErrors } from "./booking/bookingTypes";

export const useAppointmentBooking = (visible: boolean, onClose: () => void, onBooked?: () => void) => {
  const { categories, servicesLoading, servicesError, loadServices } = useBookingServices();
  const slots = useBookingSlots();
  const weeklyDays = useWeeklyBookingDays();

  const [serviceType, setServiceType] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [childName, setChildName] = useState("");
  const [childDob, setChildDob] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [booked, setBooked] = useState<AppointmentRecord | null>(null);

  const resident = useBookingResident();

  // Start each booking from a clean slate.
  useSyncOnChange([visible], () => {
    if (!visible) return;
    setServiceType(null);
    setReason("");
    setNotes("");
    setChildName("");
    setChildDob("");
    setConfirmed(false);
    setErrors({});
    setBooked(null);
    slots.resetSlots();
    weeklyDays.resetDays();
  });

  useEffect(() => {
    if (!visible) return;
    void loadServices();
  }, [visible, loadServices]);

  const serviceOptions = useMemo(() => buildServiceOptions(categories), [categories]);
  const selectedService = serviceOptions.find((option) => option.id === serviceType) ?? null;
  const servicesUnavailable = !servicesLoading && serviceOptions.length === 0;
  const weekly = isWeeklyService(serviceType);

  const clearError = useCallback((field: keyof BookingErrors) => {
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }, []);

  const handleBooked = useCallback(
    (appointment: AppointmentRecord) => {
      setBooked(appointment);
      onBooked?.();
    },
    [onBooked]
  );

  const draft: BookingDraft = {
    serviceType,
    weekly,
    scheduleId: slots.scheduleId,
    slotStart: slots.slotStart,
    dateKey: weeklyDays.dateKey,
    reason,
    notes,
    childName,
    childDob,
    confirmed,
  };
  const { submitting, submitError, setSubmitError, submit, startNewAttempt } = useBookingSubmit({
    draft,
    onBooked: handleBooked,
    setErrors,
    onSlotRefused: weekly ? weeklyDays.reload : slots.reloadAfterRefusal,
  });

  // Each kind of service loads its own dates; the other picker is emptied.
  const chooseService = (id: string) => {
    if (id === serviceType) return;
    setServiceType(id);
    setErrors({});
    setSubmitError(null);
    const nextIsWeekly = isWeeklyService(id);
    weeklyDays.loadForService(nextIsWeekly ? id : null);
    slots.loadForService(nextIsWeekly ? null : id);
  };

  const close = () => {
    if (submitting) return;
    slots.discardPending();
    weeklyDays.discardPending();
    startNewAttempt();
    onClose();
  };

  return {
    step: booked ? 2 : 1,
    booked,
    resident,
    serviceOptions,
    selectedService,
    servicesLoading,
    servicesError,
    servicesUnavailable,
    loadServices,
    serviceType,
    weekly,
    chooseService,
    slots,
    weeklyDays,
    reason,
    setReason,
    notes,
    setNotes,
    childName,
    setChildName,
    childDob,
    setChildDob,
    confirmed,
    toggleConfirmed: () => setConfirmed((previous) => !previous),
    errors,
    clearError,
    submitting,
    submitError,
    submit,
    close,
    isComplete: isDraftComplete(draft),
  };
};

export type AppointmentBooking = ReturnType<typeof useAppointmentBooking>;
