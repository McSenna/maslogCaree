/**
 * Splits a resident's appointments into "upcoming" and "past" for the dashboard table. Import-free
 * (types are structural) so `node --test` can load it.
 */

type AppointmentLike = {
  status: string;
  slotStart?: string | null;
  createdAt?: string;
};

export type AppointmentTab = "upcoming" | "past";

const OPEN_STATUSES = new Set(["pending", "confirmed", "rescheduled", "processing"]);
const CLOSED_STATUSES = new Set(["completed", "declined", "cancelled"]);

const time = (iso: string | null | undefined): number | null => {
  if (!iso) return null;
  const value = new Date(iso).getTime();
  return Number.isFinite(value) ? value : null;
};

const startOfDay = (now: Date) => new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

/**
 * Upcoming: still open and either unscheduled (a request waiting for a slot) or slotted for today or
 * later. Anything closed, or open with a slot before today, is past.
 */
export const tabOf = (appointment: AppointmentLike, now: Date = new Date()): AppointmentTab => {
  if (CLOSED_STATUSES.has(appointment.status)) return "past";
  if (!OPEN_STATUSES.has(appointment.status)) return "past";
  const slot = time(appointment.slotStart);
  return slot === null || slot >= startOfDay(now) ? "upcoming" : "past";
};

/** Upcoming soonest first, with unscheduled requests after the booked ones; past newest first. */
export const appointmentsFor = <T extends AppointmentLike>(
  appointments: T[],
  tab: AppointmentTab,
  now: Date = new Date()
): T[] => {
  const rows = appointments.filter((appointment) => tabOf(appointment, now) === tab);
  const key = (appointment: T) => time(appointment.slotStart) ?? time(appointment.createdAt) ?? 0;

  if (tab === "upcoming") {
    return rows.sort((a, b) => {
      const sa = time(a.slotStart);
      const sb = time(b.slotStart);
      if (sa === null && sb === null) return key(a) - key(b);
      if (sa === null) return 1;
      if (sb === null) return -1;
      return sa - sb;
    });
  }
  return rows.sort((a, b) => key(b) - key(a));
};
