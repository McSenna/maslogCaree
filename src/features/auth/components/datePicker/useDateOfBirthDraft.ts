import { useCallback, useState } from "react";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";

import { DEFAULT_BIRTH_YEAR } from "../../constants/registrationFields";
import { toIsoBirthDate } from "../../utils/dateOfBirth";
import {
  clampToPast,
  isFutureMonth,
  parseIsoDate,
  startOfToday,
} from "./calendarMonth";

export type CalendarStart = { year: number; monthIndex: number };

const ADULT_START: CalendarStart = { year: DEFAULT_BIRTH_YEAR, monthIndex: 0 };

/** `opensAt` is the month shown while nothing is picked: an adult's default year, or this month for a child. */
export const useDateOfBirthDraft = (value: string, visible: boolean, opensAt: CalendarStart = ADULT_START) => {
  const initial = parseIsoDate(value);
  const [year, setYear] = useState(initial?.year ?? opensAt.year);
  const [monthIndex, setMonthIndex] = useState(initial?.monthIndex ?? opensAt.monthIndex);
  const [selected, setSelected] = useState(value && initial ? value : "");

  // Re-seed the draft each time the picker opens so Cancel truly discards edits.
  useSyncOnChange([visible, value], () => {
    if (!visible) return;

    const parsed = parseIsoDate(value);
    setYear(parsed?.year ?? opensAt.year);
    setMonthIndex(parsed?.monthIndex ?? opensAt.monthIndex);
    setSelected(parsed ? value : "");
  });

  const goToPreviousMonth = useCallback(() => {
    setMonthIndex((current) => {
      if (current > 0) return current - 1;
      setYear((currentYear) => currentYear - 1);
      return 11;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setMonthIndex((current) => {
      const nextMonth = current === 11 ? 0 : current + 1;
      const nextYear = current === 11 ? year + 1 : year;
      if (isFutureMonth(nextYear, nextMonth)) return current;
      if (current === 11) setYear(nextYear);
      return nextMonth;
    });
  }, [year]);

  const selectYear = useCallback(
    (nextYear: number) => {
      const today = startOfToday();
      const safeMonth =
        nextYear === today.getFullYear() ? Math.min(monthIndex, today.getMonth()) : monthIndex;

      setYear(nextYear);
      setMonthIndex(safeMonth);
      setSelected((current) => {
        const parsed = parseIsoDate(current);
        if (!parsed) return current;
        const day = clampToPast(nextYear, safeMonth, parsed.day);
        const iso = toIsoBirthDate(nextYear, safeMonth, day);
        return new Date(nextYear, safeMonth, day) > today ? "" : iso;
      });
    },
    [monthIndex]
  );

  const canGoForward = !isFutureMonth(
    monthIndex === 11 ? year + 1 : year,
    monthIndex === 11 ? 0 : monthIndex + 1
  );

  return {
    year,
    monthIndex,
    selected,
    setSelected,
    goToPreviousMonth,
    goToNextMonth,
    selectYear,
    canGoForward,
  };
};
