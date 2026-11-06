import { useCallback, useRef, useState } from "react";

import type { RegularOptions, RegularQuery } from "@/types/appointments.types";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

import { keepSlot } from "./scheduleRules";

const LOAD_ERROR = "We could not load the open dates and times. Check your connection, then try again.";

/** Loads the options for a service (booking) or an appointment (reschedule). */
export type RegularFetcher = (key: string, query: RegularQuery) => Promise<RegularOptions>;

type Pending = "month" | "day" | null;

/**
 * State for the calendar and time picker of a regular-schedule service. Every
 * load comes from the resident's action, and only the latest may update state,
 * so a slow answer for an earlier date never replaces the current one. A chosen
 * time survives a reload only while the server still lists it.
 */
export const useRegularSchedule = (fetcher: RegularFetcher) => {
  const [options, setOptions] = useState<Omit<RegularOptions, "day"> | null>(null);
  const [day, setDay] = useState<RegularOptions["day"]>(null);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [slotStart, setSlotStart] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const [error, setError] = useState<string | null>(null);
  const keyRef = useRef<string | null>(null);
  const latestLoad = useRef(0);
  const lastRequest = useRef<{ query: RegularQuery; what: Pending; keep: string | null }>({ query: {}, what: "month", keep: null });

  const load = useCallback(
    async (query: RegularQuery, what: Pending, keep: string | null) => {
      const key = keyRef.current;
      if (!key) return;
      const loadId = (latestLoad.current += 1);
      lastRequest.current = { query, what, keep };
      setPending(what);
      setError(null);
      try {
        const next = await fetcher(key, query);
        if (loadId !== latestLoad.current) return;
        setOptions({ schedule: next.schedule, month: next.month });
        // A month-only load (paging the calendar) leaves the chosen date alone.
        if (query.date || !query.month) {
          setDay(next.day);
          setDateKey(next.day?.dateKey ?? query.date ?? null);
          setSlotStart(keepSlot(next.day?.slots, keep));
        }
      } catch (caught: unknown) {
        if (loadId !== latestLoad.current) return;
        setError(getApiErrorMessage(caught, LOAD_ERROR));
      } finally {
        if (loadId === latestLoad.current) setPending(null);
      }
    },
    [fetcher]
  );

  /** State only, so a form can call it while rendering a freshly opened modal. */
  const reset = useCallback(() => {
    setOptions(null);
    setDay(null);
    setDateKey(null);
    setSlotStart(null);
    setPending(null);
    setError(null);
  }, []);

  /** For event handlers: a load still in flight is ignored when it lands. */
  const discardPending = useCallback(() => {
    latestLoad.current += 1;
    keyRef.current = null;
  }, []);

  const activate = useCallback(
    (key: string | null) => {
      discardPending();
      reset();
      keyRef.current = key;
      if (key) void load({}, "month", null);
    },
    [discardPending, load, reset]
  );

  const monthKey = options?.month.monthKey ?? null;
  const withDate = (query: RegularQuery): RegularQuery => (dateKey ? { ...query, date: dateKey } : query);

  const goToMonth = (nextMonth: string) => void load(withDate({ month: nextMonth }), "month", slotStart);

  // The old time belongs to the old date, so a new date always starts with no time chosen.
  const selectDate = (nextDate: string) => {
    if (nextDate === dateKey) return;
    setDateKey(nextDate);
    setDay(null);
    setSlotStart(null);
    void load({ month: monthKey ?? nextDate.slice(0, 7), date: nextDate }, "day", null);
  };

  /** After the server refused the time: fresh counts and times, with the refused time cleared. */
  const reloadAfterRefusal = () => {
    if (monthKey) void load(withDate({ month: monthKey }), "day", null);
  };

  const retry = () => void load(lastRequest.current.query, lastRequest.current.what, lastRequest.current.keep);

  return {
    schedule: options?.schedule ?? null,
    month: options?.month ?? null,
    day,
    dateKey,
    slotStart,
    selectedSlot: day?.slots.find((slot) => slot.start === slotStart) ?? null,
    monthLoading: pending === "month",
    dayLoading: pending === "day",
    error,
    activate,
    reset,
    discardPending,
    goToMonth,
    selectDate,
    selectSlot: setSlotStart,
    reloadAfterRefusal,
    retry,
  };
};

export type RegularSchedulePicker = ReturnType<typeof useRegularSchedule>;
