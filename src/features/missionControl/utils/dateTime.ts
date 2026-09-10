/**
 * Date and time conversions for the mission scheduling forms.
 *
 * The API speaks `YYYY-MM-DD` dates and `HH:mm` times, while the native picker
 * speaks `Date`. Everything that crosses that boundary lives here so the forms
 * never hand the server a locale-formatted string by accident.
 */

const pad2 = (value: number): string => String(value).padStart(2, "0");

/** A `Date` in the device's own timezone → the `YYYY-MM-DD` the API stores. */
export function toIsoDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** A `Date` → the `HH:mm` the API stores. */
export function toClockTime(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/**
 * `YYYY-MM-DD` → a local-midnight `Date` for the picker.
 *
 * Built field by field rather than through `new Date(key)`, which parses a
 * bare date as UTC and lands on the previous day west of Greenwich.
 */
export function fromIsoDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

/** `HH:mm` → today's date at that time, for the picker's initial value. */
export function fromClockTime(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(Number.isFinite(hours) ? hours : 0, Number.isFinite(minutes) ? minutes : 0, 0, 0);
  return date;
}

/** `HH:mm` → minutes since midnight, or `NaN` when the string is not a time. */
export function toMinutesOfDay(time: string): number {
  const [hours, minutes] = String(time).split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return NaN;
  return hours * 60 + minutes;
}

/**
 * Whether a time range is orderable.
 *
 * An unparseable bound passes: the server validates the range too, and
 * refusing here on a value we simply failed to read would block a save the API
 * would have accepted.
 */
export function isEndAfterStart(start: string, end: string): boolean {
  const startMinutes = toMinutesOfDay(start);
  const endMinutes = toMinutesOfDay(end);
  if (!Number.isFinite(startMinutes) || !Number.isFinite(endMinutes)) return true;
  return endMinutes > startMinutes;
}

/** An ISO timestamp → the day key, for comparing a record against a form value. */
export function isoTimestampToDateKey(timestamp: string | undefined): string {
  return timestamp ? new Date(timestamp).toISOString().slice(0, 10) : "";
}
