/**
 * Immunization booking checks with no React or app imports, so `node --test`
 * can load them. They mirror the server's rules, which stay the final word.
 */
import type { BookingErrors } from "./bookingTypes.ts";

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;
const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;

/** The barangay-calendar day of a timestamp, as "YYYY-MM-DD" (Philippine time has no DST). */
export const appDateKey = (value: string | Date): string =>
  new Date(new Date(value).getTime() + MANILA_OFFSET_MS).toISOString().slice(0, 10);

/** Today's date on the barangay's calendar, as "YYYY-MM-DD". */
export const appTodayKey = (now: Date = new Date()): string => appDateKey(now);

export const validateChildName = (raw: string): string | undefined => {
  const name = raw.trim().replace(/\s+/g, " ");
  if (!name) return "Enter the child's full name.";
  if (name.length < 2 || name.length > 120 || !NAME_PATTERN.test(name)) {
    return "Use letters only, like Juan Dela Cruz.";
  }
  return undefined;
};

export const validateChildBirthDate = (dateKey: string, todayKey: string = appTodayKey()): string | undefined => {
  if (!dateKey) return "Enter the child's date of birth.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return "Choose the date of birth from the calendar.";
  if (dateKey > todayKey) return "The date of birth can't be in the future.";
  return undefined;
};

type WeeklyBookingInput = {
  serviceType: string | null;
  dateKey: string | null;
  childName: string;
  childDob: string;
  confirmed: boolean;
};

/** No reason, notes, or time: a weekly booking is the child, the day, and the confirmation. */
export const validateWeeklyBooking = (input: WeeklyBookingInput, todayKey?: string): BookingErrors => {
  const errors: BookingErrors = {};
  if (!input.serviceType) errors.serviceType = "Choose the service you need.";
  const childName = validateChildName(input.childName);
  if (childName) errors.childName = childName;
  const childDob = validateChildBirthDate(input.childDob, todayKey);
  if (childDob) errors.childDob = childDob;
  if (!input.dateKey) errors.slot = "Choose a Wednesday with open times.";
  if (!input.confirmed) errors.confirmed = "Confirm that your appointment details are correct.";
  return errors;
};
