import { MONTHS } from "../constants/registrationFields";

/** `1998-04-07` → "April 7, 1998". Returns the raw value if it is not a date. */
export function formatBirthDate(raw: string): string {
  if (!raw) return "";
  const [year, month, day] = raw.split("-");
  if (!year || !month || !day) return raw;
  return `${MONTHS[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
}

/** How many days the given month actually has, so the day wheel can be trimmed. */
export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Year, month index and day → the `YYYY-MM-DD` the API stores. */
export function toIsoBirthDate(year: number, monthIndex: number, day: number): string {
  const paddedMonth = String(monthIndex + 1).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");
  return `${year}-${paddedMonth}-${paddedDay}`;
}
