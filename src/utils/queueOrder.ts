import type { AppointmentRecord } from "@/services/appointments";

export const sortQueueBySlot = (appointments: AppointmentRecord[]): AppointmentRecord[] => {
  return [...appointments].sort((a, b) => {
    const left = a.slotStart ? new Date(a.slotStart).getTime() : Number.MAX_SAFE_INTEGER;
    const right = b.slotStart ? new Date(b.slotStart).getTime() : Number.MAX_SAFE_INTEGER;
    return left - right;
  });
};
