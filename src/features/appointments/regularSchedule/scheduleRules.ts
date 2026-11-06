/**
 * Picker decisions for a regular-schedule service (BP checking), with no React
 * or app imports so `node --test` can load them. The server decides which days
 * and times are open; these only lay them out and keep the selection honest.
 */
import type { RegularDay, RegularDayStatus, RegularOptions, RegularSlot } from "@/types/appointments.types";

import { formatClock, formatDateKey, slotEndTime, weekdayOfKey } from "./scheduleFormat.ts";

export type CalendarCell =
  | { kind: "blank"; key: string }
  | { kind: "day"; key: string; dateKey: string; day: number; status: RegularDayStatus; openSlots: number; selectable: boolean };

const STATUS_TEXT: Record<RegularDayStatus, string> = {
  open: "",
  full: "fully booked",
  ended: "no times left today",
  closed: "closed",
  past: "past date",
  beyond: "not open for booking yet",
};

const daysInMonth = (monthKey: string) => {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
};

/** Leading blanks, then one cell per day. A day the server did not list counts as closed. */
export const buildMonthCells = (monthKey: string, days: RegularDay[]): CalendarCell[] => {
  const byKey = new Map(days.map((day) => [day.dateKey, day]));
  const leading = weekdayOfKey(`${monthKey}-01`);
  const blanks: CalendarCell[] = Array.from({ length: leading }, (_, index) => ({ kind: "blank", key: `blank-${index}` }));
  const cells: CalendarCell[] = Array.from({ length: daysInMonth(monthKey) }, (_, index) => {
    const dateKey = `${monthKey}-${String(index + 1).padStart(2, "0")}`;
    const listed = byKey.get(dateKey);
    const status = listed?.status ?? "closed";
    return { kind: "day", key: dateKey, dateKey, day: index + 1, status, openSlots: listed?.openSlots ?? 0, selectable: status === "open" };
  });
  return [...blanks, ...cells];
};

export const openTimesText = (count: number): string => (count === 1 ? "1 open time" : `${count} open times`);

/** What a screen reader hears for a calendar day: the full date, then its state. */
export const dayAccessibilityLabel = (cell: { dateKey: string; status: RegularDayStatus; openSlots: number }, isSelected: boolean, isToday: boolean): string =>
  [
    formatDateKey(cell.dateKey),
    isToday ? "today" : null,
    cell.status === "open" ? openTimesText(cell.openSlots) : STATUS_TEXT[cell.status],
    isSelected ? "selected" : null,
  ]
    .filter(Boolean)
    .join(", ");

export const canGoToPreviousMonth = (monthKey: string, todayKey: string): boolean => monthKey > todayKey.slice(0, 7);

/** No booking horizon means every later month can be shown. */
export const canGoToNextMonth = (monthKey: string, lastBookableDate: string | null): boolean =>
  !lastBookableDate || monthKey < lastBookableDate.slice(0, 7);

/** Why the chosen day lists no time, in words the resident can act on. */
export const noSlotsMessage = (status: RegularDayStatus, serviceLabel: string): string => {
  switch (status) {
    case "full":
      return "Every time on this date is booked. Choose another date.";
    case "ended":
      return "Today's appointment times have passed. Choose another date.";
    case "past":
      return "This date has passed. Choose today or a later date.";
    case "beyond":
      return "This date is not open for booking yet. Choose an earlier date.";
    default:
      return `${serviceLabel} is closed on this day. Choose another date.`;
  }
};

export type SlotGroup = { label: string; slots: RegularSlot[] };

export const groupSlots = (slots: RegularSlot[]): SlotGroup[] =>
  [
    { label: "Morning", slots: slots.filter((slot) => slot.period === "morning") },
    { label: "Afternoon", slots: slots.filter((slot) => slot.period === "afternoon") },
  ].filter((group) => group.slots.length > 0);

/** A time stays chosen only while the freshly loaded list still offers it. */
export const keepSlot = (slots: RegularSlot[] | undefined, slotStart: string | null): string | null =>
  slotStart && slots?.some((slot) => slot.start === slotStart) ? slotStart : null;

/** "Monday, November 9, 2026 at 9:20 AM", from what the server listed. */
export const selectionText = (dateKey: string, slot: RegularSlot | null): string =>
  slot ? `${formatDateKey(dateKey)} at ${formatClock(slot.time)}` : formatDateKey(dateKey);

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

/** Accepts only a response shaped like the regular-schedule options, so an old server cannot crash the picker. */
export const readRegularOptions = (data: unknown): RegularOptions | null => {
  if (!isRecord(data) || data.scheduling !== "regular" || !isRecord(data.schedule) || !isRecord(data.month)) return null;
  const month = data.month as RegularOptions["month"];
  if (typeof month.monthKey !== "string" || !Array.isArray(month.days)) return null;
  const day = isRecord(data.day) && Array.isArray(data.day.slots) ? (data.day as RegularOptions["day"]) : null;
  return { schedule: data.schedule as RegularOptions["schedule"], month, day };
};

/** What the Time box shows: the chosen range, or why there is nothing to choose yet. */
export const timeFieldText = (input: {
  dateKey: string | null;
  dayLoading: boolean;
  day: { slots: RegularSlot[] } | null;
  selectedSlot: RegularSlot | null;
}): { value: string | null; placeholder: string; disabled: boolean } => {
  if (!input.dateKey) return { value: null, placeholder: "Choose a date first", disabled: true };
  if (input.dayLoading) return { value: null, placeholder: "Checking open times...", disabled: false };
  if (input.selectedSlot) {
    return { value: `${formatClock(input.selectedSlot.time)} to ${formatClock(slotEndTime(input.selectedSlot))}`, placeholder: "", disabled: false };
  }
  if (input.day && input.day.slots.length === 0) return { value: null, placeholder: "No open times on this date", disabled: false };
  return { value: null, placeholder: "Choose a time", disabled: false };
};
