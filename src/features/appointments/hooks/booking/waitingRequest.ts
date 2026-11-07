import { isQueuedService } from "../../../../utils/serviceDays.ts";

type AppointmentLike = { status?: string | null; consultationType?: string | null };

/**
 * The doctor request (general checkup or consultation) this resident already
 * has waiting in the queue, if any. One may wait at a time; the server refuses
 * a second, and this only lets the form say so before the resident fills it in.
 */
export const findWaitingDoctorRequest = <T extends AppointmentLike>(appointments: readonly T[]): T | null =>
  appointments.find(
    (appointment) => appointment.status?.trim().toLowerCase() === "pending" && isQueuedService(appointment.consultationType)
  ) ?? null;
