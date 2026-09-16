import { MONTHS } from "../../constants/registrationFields";
import { daysInMonth, toIsoBirthDate } from "../../utils/dateOfBirth";

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type CalendarCell = {
  key: string;
  day: number | null;
  iso: string | null;
  disabled: boolean;
};

export const startOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const parseIsoDate = (value: string): { year: number; monthIndex: number; day: number } | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);

  if (monthIndex < 0 || monthIndex > 11) return null;
  if (day < 1 || day > daysInMonth(year, monthIndex)) return null;

  return { year, monthIndex, day };
};

export const monthLabel = (year: number, monthIndex: number): string =>
  `${MONTHS[monthIndex]} ${year}`;

export const buildCalendarCells = (year: number, monthIndex: number): CalendarCell[] => {
  const total = daysInMonth(year, monthIndex);
  const leading = new Date(year, monthIndex, 1).getDay();
  const today = startOfToday();

  const blanks: CalendarCell[] = Array.from({ length: leading }, (_, index) => ({
    key: `blank-${index}`,
    day: null,
    iso: null,
    disabled: true,
  }));

  const days: CalendarCell[] = Array.from({ length: total }, (_, index) => {
    const day = index + 1;
    return {
      key: `day-${day}`,
      day,
      iso: toIsoBirthDate(year, monthIndex, day),
      disabled: new Date(year, monthIndex, day) > today,
    };
  });

  return [...blanks, ...days];
};

export const isFutureMonth = (year: number, monthIndex: number): boolean => {
  const today = startOfToday();
  return new Date(year, monthIndex, 1) > new Date(today.getFullYear(), today.getMonth(), 1);
};

export const clampToPast = (year: number, monthIndex: number, day: number): number =>
  Math.min(day, daysInMonth(year, monthIndex));
