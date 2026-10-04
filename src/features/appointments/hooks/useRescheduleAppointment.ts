import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { fetchRescheduleOptions, rescheduleAppointment } from "@/services/appointmentActionsApi";
import type { AppointmentRecord, RescheduleOptionsResponse } from "@/types/appointments.types";
import { getApiErrorMessage, isConflictError } from "@/utils/apiErrorHandler";
import { toastError } from "@/utils/errorToast/toastError";
import { getServiceLabel } from "@/config/appointmentServices";
import { isServiceDay, serviceDayNote } from "@/utils/serviceDays";

import { chosenStartOf, dayChoicesOf, firstBookableId, isSameInstant, rescheduleBodyOf } from "./rescheduleSelection";

export type RescheduleStep = "select" | "confirm";

const SLOT_TAKEN_MESSAGE = "That time was just taken. Please pick another slot.";

type Options = Pick<RescheduleOptionsResponse, "schedules" | "days" | "scheduling" | "assignsEarliestSlot">;

const EMPTY_OPTIONS: Options = { schedules: [], days: [], scheduling: "mission", assignsEarliestSlot: false };

/**
 * Loads the dates the backend says are still open for this appointment, then
 * walks the resident through pick → confirm → submit. Availability is
 * re-checked server side on submit, so a slot taken in the meantime sends the
 * resident back to a freshly loaded list rather than failing silently.
 */
export const useRescheduleAppointment = (
  appointment: AppointmentRecord,
  onSuccess: (appointment: AppointmentRecord) => void
) => {
  const [options, setOptions] = useState<Options>(EMPTY_OPTIONS);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [slotStart, setSlotStart] = useState<string | null>(null);
  const [step, setStep] = useState<RescheduleStep>("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const appointmentId = appointment._id;
  const serviceKey = appointment.consultationType;
  const active = useRef(true);

  const loadOptions = useCallback(async () => {
    try {
      const response = await fetchRescheduleOptions(appointmentId);
      if (!active.current) return;
      // The server already limits fixed-day services to their day; this keeps
      // an older or unexpected response from offering a date it would refuse.
      const next: Options = {
        scheduling: response.scheduling === "weekly" ? "weekly" : "mission",
        assignsEarliestSlot: Boolean(response.assignsEarliestSlot),
        schedules: (response.schedules ?? []).filter((row) => isServiceDay(serviceKey, row.date)),
        days: (response.days ?? []).filter((day) => isServiceDay(serviceKey, day.date)),
      };
      setOptions(next);
      setScheduleId((current) => current ?? firstBookableId(dayChoicesOf(next)));
      setOptionsError(null);
    } catch (e: unknown) {
      if (!active.current) return;
      setOptionsError(getApiErrorMessage(e, "Unable to load available schedules."));
    } finally {
      if (active.current) setLoadingOptions(false);
    }
  }, [appointmentId, serviceKey]);

  useEffect(() => {
    active.current = true;
    // State only settles after the request resolves, never during this render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadOptions();

    return () => {
      active.current = false;
    };
  }, [loadOptions]);

  const dayChoices = useMemo(() => dayChoicesOf(options), [options]);
  const activeSchedule = options.schedules.find((s) => s.missionScheduleId === scheduleId) ?? null;
  const assignsEarliestSlot = options.assignsEarliestSlot || options.scheduling === "weekly";
  const chosenSlot = chosenStartOf(options, scheduleId, slotStart);
  const isCurrentSlot = assignsEarliestSlot && isSameInstant(chosenSlot, appointment.slotStart);

  const selectSchedule = useCallback((id: string) => {
    setScheduleId(id);
    setSlotStart(null);
  }, []);

  const submit = useCallback(async () => {
    if (!scheduleId || !chosenSlot || isSubmitting) return;
    if (!isServiceDay(serviceKey, chosenSlot)) {
      setStep("select");
      setSubmitError(serviceDayNote(serviceKey, getServiceLabel(serviceKey)));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      onSuccess(await rescheduleAppointment(appointmentId, rescheduleBodyOf(options, scheduleId, chosenSlot)));
    } catch (e: unknown) {
      if (!active.current) return;
      toastError("Appointment not rescheduled", e, { inline: true });
      if (isConflictError(e)) {
        setSlotStart(null);
        setStep("select");
        setSubmitError(getApiErrorMessage(e, SLOT_TAKEN_MESSAGE));
        void loadOptions();
      } else {
        setSubmitError(getApiErrorMessage(e, "Unable to reschedule this appointment."));
      }
    } finally {
      if (active.current) setIsSubmitting(false);
    }
  }, [appointmentId, serviceKey, scheduleId, chosenSlot, isSubmitting, onSuccess, loadOptions, options]);

  return {
    dayChoices,
    loadingOptions,
    optionsError,
    activeSchedule,
    availableSlots: activeSchedule?.availableSlotStarts ?? [],
    scheduleId,
    slotStart: chosenSlot,
    assignsEarliestSlot,
    weekly: options.scheduling === "weekly",
    isCurrentSlot,
    step,
    isSubmitting,
    submitError,
    selectSchedule,
    selectSlot: setSlotStart,
    goToConfirm: () => setStep("confirm"),
    goToSelect: () => setStep("select"),
    submit,
  };
};
