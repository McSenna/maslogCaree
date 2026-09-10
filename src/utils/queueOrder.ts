import type { AppointmentRecord } from "@/services/appointments";

/**
 * The active queue in the order a clinician works through it.
 *
 * An appointment with no slot sorts last: the queue is a running order, and a
 * row with no start time cannot be the next patient.
 */
export function sortQueueBySlot(appointments: AppointmentRecord[]): AppointmentRecord[] {
  return [...appointments].sort((a, b) => {
    const left = a.slotStart ? new Date(a.slotStart).getTime() : Number.MAX_SAFE_INTEGER;
    const right = b.slotStart ? new Date(b.slotStart).getTime() : Number.MAX_SAFE_INTEGER;
    return left - right;
  });
}
