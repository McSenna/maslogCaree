import { useCallback } from "react";

import {
  deleteMissionSchedule,
  rejectAppointment,
  type AppointmentRecord,
} from "@/services/appointments";
import { showAlert } from "@/utils/notify";
import { toast } from "@/components/feedback/toast/toastStore";

import type { MissionCatalogue } from "../useMissionCatalogue";
import { toastError } from "@/utils/errorToast/toastError";

type Input = {
  catalogue: MissionCatalogue;
  revalidate: () => Promise<void>;
  setSaving: (saving: boolean) => void;
  closeEdit: () => void;
};

export const useMissionRemovalActions = ({ catalogue, revalidate, setSaving, closeEdit }: Input) => {
  const { removeMission } = catalogue;

  const deleteMission = useCallback(
    (missionId: string) => {
      showAlert("Delete schedule", "This will move any booked appointments back to Pending.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setSaving(true);
            try {
              await deleteMissionSchedule(missionId);
              removeMission(missionId);
              closeEdit();
              toast.success("Mission schedule deleted", "Booked appointments were moved back to Pending.");
              void revalidate();
            } catch (error: unknown) {
              toastError("Unable to delete schedule", error, { fallback: "The mission schedule could not be deleted." });
            } finally {
              setSaving(false);
            }
          },
        },
      ]);
    },
    [closeEdit, removeMission, revalidate, setSaving]
  );

  const declineAppointment = useCallback(
    (appointment: AppointmentRecord) => {
      showAlert("Decline appointment", "Reject this queued request?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Decline",
          style: "destructive",
          onPress: async () => {
            try {
              await rejectAppointment(appointment._id, "Declined by medical staff");
              toast.success("Appointment declined");
              void revalidate();
            } catch (error: unknown) {
              toastError("Unable to decline appointment", error, { fallback: "The appointment could not be declined." });
            }
          },
        },
      ]);
    },
    [revalidate]
  );

  return { deleteMission, declineAppointment };
};
