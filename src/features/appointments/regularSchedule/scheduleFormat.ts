/**
 * Formatting for the regular-schedule picker, with no React or app imports so
 * `node --test` can load it. Dates arrive as "YYYY-MM-DD" keys and times as
 * "HH:MM" wall-clock strings in the app timezone, so nothing here reads the
 * device's clock or timezone.
 */
import type { RegularSchedule, RegularWindow } from "@/types/appointments.types";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const partsOf = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return { year, monthIndex: month - 1, day };
};

/** Day of week for a date key, computed on the calendar itself (0 is Sunday). */
export const weekdayOfKey = (dateKey: string): number => {
  const { year, monthIndex, day } = partsOf(dateKey);
  return new Date(Date.UTC(year, monthIndex, day)).getUTCDay();
};

/** "Monday, November 9, 2026", or "Mon, Nov 9" when short. */
export const formatDateKey = (dateKey: string, short = false): string => {
  const { year, monthIndex, day } = partsOf(dateKey);
  const weekday = WEEKDAYS[weekdayOfKey(dateKey)];
  if (short) return `${weekday.slice(0, 3)}, ${MONTHS[monthIndex].slice(0, 3)} ${day}`;
  return `${weekday}, ${MONTHS[monthIndex]} ${day}, ${year}`;
};

/** "13:20" becomes "1:20 PM". */
export const formatClock = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

export const monthLabel = (monthKey: string): string => {
  const { year, monthIndex } = partsOf(`${monthKey}-01`);
  return `${MONTHS[monthIndex]} ${year}`;
};

export const shiftMonth = (monthKey: string, delta: number): string => {
  const { year, monthIndex } = partsOf(`${monthKey}-01`);
  const shifted = new Date(Date.UTC(year, monthIndex + delta, 1));
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const windowsText = (windows: RegularWindow[]) =>
  windows.map((window) => `${formatClock(window.start)} to ${formatClock(window.end)}`).join(" and ");

const openMinutes = (windows: RegularWindow[]) =>
  windows.reduce((total, window) => total + toMinutes(window.end) - toMinutes(window.start), 0);

/** "Monday to Friday" for a run of days, "Monday and Wednesday" otherwise. */
const daysText = (weekdays: number[]): string => {
  const names = weekdays.map((day) => WEEKDAYS[day]);
  const consecutive = weekdays.every((day, index) => index === 0 || day === weekdays[index - 1] + 1);
  if (names.length > 2 && consecutive) return `${names[0]} to ${names.at(-1)}`;
  return names.length < 3 ? names.join(" and ") : `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
};

export type ScheduleLine = { label: string; value: string };

/**
 * The opening hours as short label and value lines, built only from the
 * server's schedule: days that share hours are grouped, a shorter day is
 * marked as a half day, the gap between windows is the lunch break, and every
 * other weekday is closed.
 */
export const scheduleLines = (schedule: RegularSchedule): ScheduleLine[] => {
  const groups: { weekdays: number[]; windows: RegularWindow[] }[] = [];
  for (const { weekday, windows } of schedule.weekdays) {
    const same = groups.find((group) => windowsText(group.windows) === windowsText(windows));
    if (same) same.weekdays.push(weekday);
    else groups.push({ weekdays: [weekday], windows });
  }

  const longest = Math.max(...groups.map((group) => openMinutes(group.windows)));
  const lines: ScheduleLine[] = groups.map((group) => ({
    label: `${daysText(group.weekdays)}${openMinutes(group.windows) < longest ? " (half day)" : ""}`,
    value: windowsText(group.windows),
  }));

  const widest = groups.find((group) => group.windows.length > 1);
  if (widest) {
    const breaks = widest.windows.slice(1).map((window, index) => `${formatClock(widest.windows[index].end)} to ${formatClock(window.start)}`);
    lines.push({ label: "Lunch break", value: `${breaks.join(" and ")}, no appointments` });
  }

  const open = new Set(schedule.weekdays.map((entry) => entry.weekday));
  const closed = [0, 1, 2, 3, 4, 5, 6].filter((day) => !open.has(day));
  if (closed.length) lines.push({ label: daysText(closed), value: "Closed" });
  return lines;
};

/** "12:00 PM to 1:00 PM" for a date whose hours have a break, null for a half day or a closed day. */
export const breakTextOn = (schedule: RegularSchedule, dateKey: string): string | null => {
  const windows = schedule.weekdays.find((entry) => entry.weekday === weekdayOfKey(dateKey))?.windows ?? [];
  if (windows.length < 2) return null;
  return `${formatClock(windows[0].end)} to ${formatClock(windows[1].start)}`;
};

/** The slot's end on the same wall clock: its start plus its length, so no timezone is involved. */
export const slotEndTime = (slot: { start: string; end: string; time: string }): string => {
  const length = Math.round((new Date(slot.end).getTime() - new Date(slot.start).getTime()) / 60000);
  const total = toMinutes(slot.time) + length;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};
