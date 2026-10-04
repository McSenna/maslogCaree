import { useCallback, useMemo, useState } from "react";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";

import { DEFAULT_BIRTH_YEAR } from "../../constants/registrationFields";
import { toIsoBirthDate } from "../../utils/dateOfBirth";
import { clampMonth, isOutside, monthInRange, pastOnly, yearOptions, type DateBounds } from "./calendarBounds";
import { clampDay, parseIsoDate } from "./calendarMonth";

export type CalendarStart = { year: number; monthIndex: number };

const ADULT_START: CalendarStart = { year: DEFAULT_BIRTH_YEAR, monthIndex: 0 };

/**
 * `opensAt` is the month shown while nothing is picked: an adult's default
 * year, or this month for a child. `bounds` limits the days on offer; it
 * defaults to today and earlier, as a birth date needs.
 */
export const useDateOfBirthDraft = (
  value: string,
  visible: boolean,
  opensAt: CalendarStart = ADULT_START,
  bounds: DateBounds = pastOnly()
) => {
  const { min, max } = bounds;
  const stableBounds = useMemo(() => ({ min, max }), [min, max]);
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

  const shift = useCallback(
    (step: 1 | -1) => {
      const next = monthIndex + step;
      const nextYear = next < 0 ? year - 1 : next > 11 ? year + 1 : year;
      const nextMonth = (next + 12) % 12;
      if (!monthInRange(nextYear, nextMonth, stableBounds)) return;
      setYear(nextYear);
      setMonthIndex(nextMonth);
    },
    [monthIndex, year, stableBounds]
  );

  const selectYear = useCallback(
    (nextYear: number) => {
      const safeMonth = clampMonth(nextYear, monthIndex, stableBounds);
      setYear(nextYear);
      setMonthIndex(safeMonth);
      setSelected((current) => {
        const parsed = parseIsoDate(current);
        if (!parsed) return current;
        const iso = toIsoBirthDate(nextYear, safeMonth, clampDay(nextYear, safeMonth, parsed.day));
        return isOutside(iso, stableBounds) ? "" : iso;
      });
    },
    [monthIndex, stableBounds]
  );

  const canGo = (step: 1 | -1) => {
    const next = monthIndex + step;
    return monthInRange(next < 0 ? year - 1 : next > 11 ? year + 1 : year, (next + 12) % 12, stableBounds);
  };

  return {
    year,
    monthIndex,
    selected,
    setSelected,
    goToPreviousMonth: () => shift(-1),
    goToNextMonth: () => shift(1),
    selectYear,
    canGoForward: canGo(1),
    canGoBack: canGo(-1),
    bounds: stableBounds,
    years: yearOptions(stableBounds),
  };
};
