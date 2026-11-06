/**
 * The clinic-hours rows for the booking sidebar, with no React or app imports
 * so `node --test` can load them. Every value comes from the server schedule.
 * Ranges use an en dash on screen; each row also carries a spoken label.
 */
import type { RegularSchedule, RegularWindow } from "@/types/appointments.types";

import { formatClock } from "./scheduleFormat.ts";

const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type ClinicHoursRow = { key: string; label: string; lines: string[]; spoken: string };

const range = (from: string, to: string) => `${formatClock(from)} – ${formatClock(to)}`;
const spokenRange = (from: string, to: string) => `${formatClock(from)} to ${formatClock(to)}`;
const signature = (windows: RegularWindow[]) => windows.map((window) => `${window.start}-${window.end}`).join(",");
const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};
const minutesOpen = (windows: RegularWindow[]) =>
  windows.reduce((total, window) => total + toMinutes(window.end) - toMinutes(window.start), 0);

/** "Mon–Fri" for a run of three or more, otherwise the full day names. */
const daysLabel = (days: number[]): { label: string; spoken: string } => {
  const run = days.length > 2 && days.every((day, index) => index === 0 || day === days[index - 1] + 1);
  if (run) return { label: `${SHORT[days[0]]}–${SHORT[days.at(-1) as number]}`, spoken: `${LONG[days[0]]} to ${LONG[days.at(-1) as number]}` };
  const names = days.map((day) => LONG[day]).join(", ");
  return { label: names, spoken: names };
};

export const clinicHoursRows = (schedule: RegularSchedule): ClinicHoursRow[] => {
  const groups: { days: number[]; windows: RegularWindow[] }[] = [];
  for (const { weekday, windows } of schedule.weekdays) {
    const same = groups.find((group) => signature(group.windows) === signature(windows));
    if (same) same.days.push(weekday);
    else groups.push({ days: [weekday], windows });
  }
  const longest = Math.max(...groups.map((group) => minutesOpen(group.windows)));

  const rows: ClinicHoursRow[] = groups.map((group) => {
    const { label, spoken } = daysLabel(group.days);
    const halfDay = minutesOpen(group.windows) < longest;
    const lines = group.windows.map((window) => range(window.start, window.end));
    const spokenHours = group.windows.map((window) => spokenRange(window.start, window.end)).join(" and ");
    return {
      key: `days-${group.days.join("")}`,
      label,
      lines: halfDay ? [...lines, "Half day"] : lines,
      spoken: `${spoken}, ${spokenHours}${halfDay ? ", half day" : ""}`,
    };
  });

  const split = groups.find((group) => group.windows.length > 1);
  if (split) {
    const [first, second] = split.windows;
    rows.push({
      key: "lunch",
      label: "Lunch break",
      lines: [range(first.end, second.start), "No appointments"],
      spoken: `Lunch break, ${spokenRange(first.end, second.start)}, no appointments`,
    });
  }

  const open = new Set(schedule.weekdays.map((entry) => entry.weekday));
  const closed = [0, 1, 2, 3, 4, 5, 6].filter((day) => !open.has(day));
  if (closed.length) {
    const { label, spoken } = daysLabel(closed);
    rows.push({ key: "closed", label, lines: ["Closed"], spoken: `${spoken}, closed` });
  }
  return rows;
};
