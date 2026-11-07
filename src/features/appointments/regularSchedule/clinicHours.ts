/**
 * The clinic-hours rows for the booking sidebar, with no React or app imports
 * so `node --test` can load them. Every value comes from the server schedule.
 * Ranges use an en dash on screen; each row also carries a spoken label.
 * A time never splits from its AM or PM, and a range wraps only after its dash,
 * so a narrow sidebar never shows "12:00" on one line and "PM" on the next.
 */
import type { RegularSchedule, RegularWindow } from "@/types/appointments.types";

import { formatClock } from "./scheduleFormat.ts";

const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type ClinicHoursRow = { key: string; label: string; lines: string[]; spoken: string };

const NBSP = "\u00A0";
const unbroken = (time: string) => formatClock(time).replace(" ", NBSP);
const range = (from: string, to: string) => `${unbroken(from)}${NBSP}– ${unbroken(to)}`;
const spokenRange = (from: string, to: string) => `${formatClock(from)} to ${formatClock(to)}`;
const signature = (windows: RegularWindow[]) => windows.map((window) => `${window.start}-${window.end}`).join(",");
const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};
const minutesOpen = (windows: RegularWindow[]) =>
  windows.reduce((total, window) => total + toMinutes(window.end) - toMinutes(window.start), 0);

/** Consecutive weekdays grouped: [1, 2, 3, 5] becomes [[1, 2, 3], [5]]. */
const runsOf = (days: number[]): number[][] =>
  days.reduce<number[][]>((runs, day) => {
    const last = runs.at(-1);
    if (last && day === (last.at(-1) as number) + 1) last.push(day);
    else runs.push([day]);
    return runs;
  }, []);

const andList = (parts: string[]) =>
  parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts.join("");

/**
 * Three or more days in a row read as a range ("Mon–Fri", "Mon–Wed, Fri"), in
 * short names so the label stays on one line; otherwise the full day names.
 */
const daysLabel = (days: number[]): { label: string; spoken: string } => {
  const runs = runsOf(days);
  if (!runs.some((run) => run.length > 2)) {
    const names = days.map((day) => LONG[day]).join(", ");
    return { label: names, spoken: names };
  }
  const shown = runs.flatMap((run) => (run.length > 2 ? [`${SHORT[run[0]]}–${SHORT[run.at(-1) as number]}`] : run.map((day) => SHORT[day])));
  const spoken = runs.flatMap((run) => (run.length > 2 ? [`${LONG[run[0]]} to ${LONG[run.at(-1) as number]}`] : run.map((day) => LONG[day])));
  return { label: shown.join(", "), spoken: andList(spoken) };
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
