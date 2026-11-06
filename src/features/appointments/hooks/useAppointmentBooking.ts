import { useCallback, useEffect, useMemo, useState } from "react";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";
import type { AppointmentRecord } from "@/services/appointments";
import { isAssignedTimeService, isRegularScheduleService } from "@/utils/serviceDays";
import { validateDraft, type BookingDraft } from "./booking/bookingDraft";
import { useBookingFields } from "./booking/useBookingFields";
import { hasBookingInput } from "./booking/bookingRules";
import { buildServiceOptions } from "./booking/bookingServiceOptions";
import type { BookingErrors } from "./booking/bookingTypes";
import { useBookingServices } from "./booking/useBookingServices";
import { useBookingPickers } from "./booking/useBookingPickers";
import { useBookingSubmit } from "./booking/useBookingSubmit";

export type { BookingErrors } from "./booking/bookingTypes";

export type BookingStage = "details" | "review" | "confirmed";

const MISSING_DETAILS = "Some details are missing. Check the highlighted fields.";

const stageOf = (booked: AppointmentRecord | null, reviewing: boolean): BookingStage => {
  if (booked) return "confirmed";
  return reviewing ? "review" : "details";
};

export const useAppointmentBooking = (visible: boolean, onClose: () => void, onBooked?: () => void) => {
  const { categories, servicesLoading, servicesError, loadServices } = useBookingServices();
  const pickers = useBookingPickers();
  const { slots, weeklyDays, regularPicker } = pickers;

  const [serviceType, setServiceType] = useState<string | null>(null);
  const fields = useBookingFields();
  const { reason, notes, childName, childDob, confirmed } = fields;
  const [errors, setErrors] = useState<BookingErrors>({});
  const [booked, setBooked] = useState<AppointmentRecord | null>(null);
  const [reviewing, setReviewing] = useState(false);

  // Start each booking from a clean slate.
  useSyncOnChange([visible], () => {
    if (!visible) return;
    setServiceType(null);
    fields.resetFields();
    setErrors({});
    setBooked(null);
    setReviewing(false);
    pickers.resetAll();
  });

  useEffect(() => {
    if (!visible) return;
    void loadServices();
  }, [visible, loadServices]);

  const serviceOptions = useMemo(() => buildServiceOptions(categories), [categories]);
  const selectedService = serviceOptions.find((option) => option.id === serviceType) ?? null;
  const servicesUnavailable = !servicesLoading && serviceOptions.length === 0;
  const weekly = isAssignedTimeService(serviceType);
  const regular = isRegularScheduleService(serviceType);

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
    regular,
    scheduleId: slots.scheduleId,
    slotStart: regular ? regularPicker.slotStart : slots.slotStart,
    dateKey: regular ? regularPicker.dateKey : weeklyDays.dateKey,
    reason,
    notes,
    childName,
    childDob,
    confirmed,
  };
  // A refused time means the list the resident saw is stale: back to Details, and
  // reload the picker in use so a fresh time can be chosen.
  const reloadAfterRefusal = () => {
    setReviewing(false);
    pickers.reloadFor(serviceType);
  };
  const { submitting, submitError, setSubmitError, submit, startNewAttempt } = useBookingSubmit({
    draft,
    onBooked: handleBooked,
    setErrors,
    onSlotRefused: reloadAfterRefusal,
  });

  /** Checks the Details step first; the server checks everything again on booking. */
  const continueToReview = () => {
    const found = validateDraft(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return setSubmitError(MISSING_DETAILS);
    setSubmitError(null);
    setReviewing(true);
  };

  // Each kind of service loads its own dates; the other pickers are emptied.
  const chooseService = (id: string) => {
    if (id === serviceType) return;
    setServiceType(id);
    setErrors({});
    setSubmitError(null);
    pickers.loadFor(id);
  };

  const close = () => {
    if (submitting) return;
    pickers.discardAll();
    startNewAttempt();
    onClose();
  };

  return {
    stage: stageOf(booked, reviewing),
    continueToReview,
    backToDetails: () => setReviewing(false),
    booked,
    serviceOptions,
    selectedService,
    servicesLoading,
    servicesError,
    servicesUnavailable,
    loadServices,
    serviceType,
    weekly,
    regular,
    chooseService,
    slots,
    weeklyDays,
    regularPicker,
    ...fields,
    errors,
    clearError,
    submitting,
    submitError,
    submit,
    close,
    /** A confirmed booking is saved, so only an unsent form has anything to lose. */
    hasUnsavedInput: !booked && hasBookingInput(draft),
  };
};

export type AppointmentBooking = ReturnType<typeof useAppointmentBooking>;
