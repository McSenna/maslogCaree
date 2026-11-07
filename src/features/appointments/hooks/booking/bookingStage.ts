import type { AppointmentRecord } from "@/services/appointments";

export type BookingStage = "details" | "review" | "confirmed";

export const MISSING_DETAILS = "Some details are missing. Check the highlighted fields.";

export const ALREADY_WAITING =
  "You already have a doctor request in the queue. You can send a new one once it is scheduled.";

export const stageOf = (booked: AppointmentRecord | null, reviewing: boolean): BookingStage => {
  if (booked) return "confirmed";
  return reviewing ? "review" : "details";
};
