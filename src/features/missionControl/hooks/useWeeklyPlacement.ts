import { useCallback } from "react";

import { toast } from "@/components/feedback/toast/toastStore";
import { assignAppointment, type AppointmentRecord } from "@/services/appointments";

import type { AssignMode } from "./useSlotAssignment";
import { toastError } from "@/utils/errorToast/toastError";

const formatPlaced = (iso: string | null | undefined): string => {
  if (!iso) return "the first open position";
  const date = new Date(iso);
  return `${date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} at ${date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
};

/**
 * Immunization never goes on a mission. Placing a pending request puts it on
 * the first open Wednesday position (the server chooses); moving one is the
 * resident's reschedule, so staff are told so instead of being shown slots.
 */
export const useWeeklyPlacement = ({
  setSaving,
  onPlaced,
}: {
  setSaving: (saving: boolean) => void;
  onPlaced: () => Promise<void>;
}) =>
  useCallback(
    async (appointment: AppointmentRecord, mode: AssignMode) => {
      if (mode === "reassign") {
        toast.info(
          "Immunization keeps its own Wednesday schedule",
          "The resident can reschedule it in the app, and it gets the first open time. You can also cancel it."
        );
        return;
      }
      setSaving(true);
      try {
        const placed = await assignAppointment(appointment._id, {});
        toast.success("Immunization scheduled", `Placed on ${formatPlaced(placed.slotStart)}, first come, first served.`);
        await onPlaced();
      } catch (error: unknown) {
        toastError("Unable to schedule the immunization", error, { fallback: "The request could not be placed." });
      } finally {
        setSaving(false);
      }
    },
    [onPlaced, setSaving]
  );
