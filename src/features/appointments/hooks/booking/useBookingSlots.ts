import { useCallback, useRef, useState } from "react";

import { fetchBookingOptions, type RescheduleOptionSchedule } from "@/services/appointments";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { isServiceDay } from "@/utils/serviceDays";

import { keepOpenSelection, type BookingSelection } from "./bookingRules";

const LOAD_ERROR = "We could not load open times. Check your connection, then try again.";
const EMPTY_SELECTION: BookingSelection = { scheduleId: null, slotStart: null };

/**
 * Open mission dates and times for the chosen service. Loads run from the
 * resident's actions, not an effect, and only the latest one may update state,
 * so switching service mid-load never shows the previous service's times.
 */
export const useBookingSlots = () => {
  const [schedules, setSchedules] = useState<RescheduleOptionSchedule[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selection, setSelection] = useState<BookingSelection>(EMPTY_SELECTION);
  const serviceRef = useRef<string | null>(null);
  const latestLoad = useRef(0);

  const load = useCallback(async (serviceKey: string, keep: BookingSelection) => {
    const loadId = (latestLoad.current += 1);
    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const { schedules: rows } = await fetchBookingOptions(serviceKey);
      if (loadId !== latestLoad.current) return;
      // The server already limits fixed-day services to their day; this keeps an
      // older or unexpected response from offering a date it would refuse.
      const valid = rows.filter((row) => isServiceDay(serviceKey, row.date));
      setSchedules(valid);
      setSelection(keepOpenSelection(valid, keep.scheduleId, keep.slotStart));
    } catch (error: unknown) {
      if (loadId !== latestLoad.current) return;
      setSchedules([]);
      setSelection(EMPTY_SELECTION);
      setSlotsError(getApiErrorMessage(error, LOAD_ERROR));
    } finally {
      if (loadId === latestLoad.current) setSlotsLoading(false);
    }
  }, []);

  /** State only, so the form can call it while rendering a freshly opened modal. */
  const resetSlots = useCallback(() => {
    setSchedules([]);
    setSelection(EMPTY_SELECTION);
    setSlotsError(null);
    setSlotsLoading(false);
  }, []);

  /** For event handlers: a load still in flight is ignored when it lands. */
  const discardPending = useCallback(() => {
    latestLoad.current += 1;
    serviceRef.current = null;
  }, []);

  const loadForService = useCallback(
    (serviceKey: string | null) => {
      discardPending();
      serviceRef.current = serviceKey;
      if (serviceKey) {
        void load(serviceKey, EMPTY_SELECTION);
        return;
      }
      resetSlots();
    },
    [discardPending, load, resetSlots]
  );

  /** Reloads after the server refused a time; the date stays, the time must be chosen again. */
  const reloadAfterRefusal = useCallback(() => {
    if (serviceRef.current) void load(serviceRef.current, { scheduleId: selection.scheduleId, slotStart: null });
  }, [load, selection.scheduleId]);

  const retryLoad = useCallback(() => {
    if (serviceRef.current) void load(serviceRef.current, selection);
  }, [load, selection]);

  const activeSchedule = schedules.find((schedule) => schedule.missionScheduleId === selection.scheduleId) ?? null;

  return {
    schedules,
    slotsLoading,
    slotsError,
    scheduleId: selection.scheduleId,
    slotStart: selection.slotStart,
    activeSchedule,
    availableSlots: activeSchedule?.availableSlotStarts ?? [],
    loadForService,
    reloadAfterRefusal,
    retryLoad,
    resetSlots,
    discardPending,
    selectSchedule: (scheduleId: string) => setSelection({ scheduleId, slotStart: null }),
    selectSlot: (slotStart: string) => setSelection((current) => ({ ...current, slotStart })),
  };
};

export type BookingSlots = ReturnType<typeof useBookingSlots>;
