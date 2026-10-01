import { useCallback, useRef, useState } from "react";

import { fetchBookingOptions, type WeeklyDayOption } from "@/services/appointments";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { isServiceDay } from "@/utils/serviceDays";

import { keepOpenDay } from "./bookingRules";

const LOAD_ERROR = "We could not load the open Wednesdays. Check your connection, then try again.";

/**
 * The days of a weekly service (immunization) and the one the resident picked.
 * No time is ever chosen here: each day only carries the time the next booking
 * would get right now, and the server assigns the real one on booking.
 */
export const useWeeklyBookingDays = () => {
  const [days, setDays] = useState<WeeklyDayOption[]>([]);
  const [daysLoading, setDaysLoading] = useState(false);
  const [daysError, setDaysError] = useState<string | null>(null);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [intervalMinutes, setIntervalMinutes] = useState<number | null>(null);
  const serviceRef = useRef<string | null>(null);
  const latestLoad = useRef(0);

  const load = useCallback(async (serviceKey: string, keepKey: string | null) => {
    const loadId = (latestLoad.current += 1);
    setDaysLoading(true);
    setDaysError(null);
    try {
      const options = await fetchBookingOptions(serviceKey);
      if (loadId !== latestLoad.current) return;
      const valid = options.days.filter((day) => isServiceDay(serviceKey, day.date));
      setDays(valid);
      setIntervalMinutes(options.intervalMinutes);
      setDateKey(keepOpenDay(valid, keepKey));
    } catch (error: unknown) {
      if (loadId !== latestLoad.current) return;
      setDays([]);
      setDateKey(null);
      setDaysError(getApiErrorMessage(error, LOAD_ERROR));
    } finally {
      if (loadId === latestLoad.current) setDaysLoading(false);
    }
  }, []);

  /** State only, so the form can call it while rendering a freshly opened modal. */
  const resetDays = useCallback(() => {
    setDays([]);
    setDateKey(null);
    setDaysError(null);
    setDaysLoading(false);
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
        void load(serviceKey, null);
        return;
      }
      resetDays();
    },
    [discardPending, load, resetDays]
  );

  const reload = useCallback(() => {
    if (serviceRef.current) void load(serviceRef.current, dateKey);
  }, [load, dateKey]);

  return {
    days,
    daysLoading,
    daysError,
    dateKey,
    intervalMinutes,
    selectedDay: days.find((day) => day.dateKey === dateKey) ?? null,
    loadForService,
    reload,
    resetDays,
    discardPending,
    selectDay: setDateKey,
  };
};

export type WeeklyBookingDays = ReturnType<typeof useWeeklyBookingDays>;
