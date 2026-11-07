import { useCallback, useEffect, useMemo, useState } from "react";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";
import type { AppointmentRecord } from "@/services/appointments";
import { isAssignedTimeService, isQueuedService, isRegularScheduleService } from "@/utils/serviceDays";
import { validateDraft, type BookingDraft } from "./booking/bookingDraft";
import { useBookingFields } from "./booking/useBookingFields";
import { hasBookingInput } from "./booking/bookingRules";
import { buildServiceOptions } from "./booking/bookingServiceOptions";
import type { BookingErrors } from "./booking/bookingTypes";
import { ALREADY_WAITING, MISSING_DETAILS, stageOf } from "./booking/bookingStage";
import { useBookingServices } from "./booking/useBookingServices";
import { useBookingPickers } from "./booking/useBookingPickers";
import { useBookingSubmit } from "./booking/useBookingSubmit";

export type { BookingErrors } from "./booking/bookingTypes";

export type { BookingStage } from "./booking/bookingStage";

/** `waitingRequest`: the resident's doctor request already in the queue, which blocks a second one. */
export const useAppointmentBooking = (
  visible: boolean,
  onClose: () => void,
  onBooked?: () => void,
  waitingRequest: AppointmentRecord | null = null
) => {
  const { categories, servicesLoading, servicesError, loadServices } = useBookingServices();
  const pickers = useBookingPickers();
  const { weeklyDays, regularPicker } = pickers;

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
  /** General checkup and consultation: requested without a time, placed by the queue. */
  const queued = isQueuedService(serviceType);
  const queueBlocked = queued && Boolean(waitingRequest);

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
    slotStart: regular ? regularPicker.slotStart : null,
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
    if (queueBlocked) return setSubmitError(ALREADY_WAITING);
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
    queued,
    queueBlocked,
    waitingRequest,
    chooseService,
    weeklyDays,
    regularPicker,
    ...fields,
    errors,
    clearError,
    submitting,
    submitError,
    submit,
    close,
    /** A saved booking or request has nothing to lose, so only an unsent form asks first. */
    hasUnsavedInput: !booked && hasBookingInput(draft),
  };
};

export type AppointmentBooking = ReturnType<typeof useAppointmentBooking>;
