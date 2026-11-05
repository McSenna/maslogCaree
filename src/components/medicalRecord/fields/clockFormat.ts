// Import-free, so `node --test` can load it.

const CLOCK = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** "09:30" from a Date's own hours and minutes, with no timezone conversion. */
export const toClock = (date: Date): string =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

/** Today at that time, for a picker to open on. Blank or invalid opens on the current time. */
export const clockToDate = (clock: string): Date => {
  const match = CLOCK.exec(clock);
  const date = new Date();
  if (match) date.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return date;
};

/** "9:30 AM" from "09:30". Anything else comes back as stored, so a record never loses a value. */
export const formatClock = (clock: string | null | undefined): string => {
  const value = clock ?? "";
  const match = CLOCK.exec(value);
  if (!match) return value;
  const hours = Number(match[1]);
  return `${hours % 12 || 12}:${match[2]} ${hours < 12 ? "AM" : "PM"}`;
};

export type ClockParts = { hour: number; minute: number; period: "AM" | "PM" };

/** The picker's view of a clock: hour 1 to 12, minute, and AM or PM. */
export const clockParts = (clock: string): ClockParts => {
  const [hours, minutes] = clock.split(":").map(Number);
  return { hour: hours % 12 || 12, minute: minutes, period: hours < 12 ? "AM" : "PM" };
};

export const clockFromParts = ({ hour, minute, period }: ClockParts): string => {
  const hours = (hour % 12) + (period === "PM" ? 12 : 0);
  return `${String(hours).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

/** Moves by whole minutes, carrying into the hour and wrapping around midnight. */
export const nudgeClock = (clock: string, minutes: number): string => {
  const [hh, mm] = clock.split(":").map(Number);
  const total = (((hh * 60 + mm + minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

export const isClock = (clock: string): boolean => CLOCK.test(clock);
