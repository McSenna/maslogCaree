import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { fetchRescheduleOptions, rescheduleAppointment } from "@/services/appointmentActionsApi";
import type { AppointmentRecord, RescheduleOptionSchedule } from "@/types/appointments.types";
import { getApiErrorMessage, isConflictError } from "@/utils/apiErrorHandler";

export type RescheduleStep = "select" | "confirm";

const SLOT_TAKEN_MESSAGE = "That time was just taken. Please pick another slot.";

const firstBookableId = (schedules: RescheduleOptionSchedule[]): string | null =>
  (schedules.find((s) => s.availableSlotStarts.length > 0) ?? schedules[0])?.missionScheduleId ??
  null;

/**
 * Loads the slots the backend says are still free for this appointment, then
 * walks the resident through pick → confirm → submit. Availability is
 * re-checked server side on submit, so a slot taken in the meantime sends the
 * resident back to a freshly loaded list rather than failing silently.
 */
export const useRescheduleAppointment = (
  appointment: AppointmentRecord,
  onSuccess: (appointment: AppointmentRecord) => void
) => {
  const [schedules, setSchedules] = useState<RescheduleOptionSchedule[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [slotStart, setSlotStart] = useState<string | null>(null);

  const [step, setStep] = useState<RescheduleStep>("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const appointmentId = appointment._id;
  const active = useRef(true);

  const loadOptions = useCallback(async () => {
    try {
      const { schedules: rows } = await fetchRescheduleOptions(appointmentId);
      if (!active.current) return;
      setSchedules(rows ?? []);
      setScheduleId((current) => current ?? firstBookableId(rows ?? []));
      setOptionsError(null);
    } catch (e: unknown) {
      if (!active.current) return;
      setOptionsError(getApiErrorMessage(e, "Unable to load available schedules."));
    } finally {
      if (active.current) setLoadingOptions(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    active.current = true;
    // State only settles after the request resolves, never during this render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadOptions();

    return () => {
      active.current = false;
    };
  }, [loadOptions]);

  const activeSchedule = useMemo(
    () => schedules.find((s) => s.missionScheduleId === scheduleId) ?? null,
    [schedules, scheduleId]
  );

  const selectSchedule = useCallback((id: string) => {
    setScheduleId(id);
    setSlotStart(null);
  }, []);

  const submit = useCallback(async () => {
    if (!scheduleId || !slotStart || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const updated = await rescheduleAppointment(appointmentId, {
        missionScheduleId: scheduleId,
        slotStart,
      });
      onSuccess(updated);
    } catch (e: unknown) {
      if (!active.current) return;

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
  }, [appointmentId, scheduleId, slotStart, isSubmitting, onSuccess, loadOptions]);

  return {
    schedules,
    loadingOptions,
    optionsError,
    activeSchedule,
    availableSlots: activeSchedule?.availableSlotStarts ?? [],
    scheduleId,
    slotStart,
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
