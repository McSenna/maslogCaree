import { useCallback } from "react";

import {
  deleteMissionSchedule,
  rejectAppointment,
  type AppointmentRecord,
} from "@/services/appointments";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { showAlert } from "@/utils/notify";

import type { MissionCatalogue } from "../useMissionCatalogue";

type Input = {
  catalogue: MissionCatalogue;
  revalidate: () => Promise<void>;
  setSaving: (saving: boolean) => void;
  closeEdit: () => void;
};

export const useMissionRemovalActions = ({ catalogue, revalidate, setSaving, closeEdit }: Input) => {
  const { loadMissionDetail, setSelectedMissionId } = catalogue;

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
              await revalidate();
              if (catalogue.selectedMissionId === missionId) setSelectedMissionId(null);
              closeEdit();
              showAlert("Deleted", "Mission schedule removed.");
            } catch (error: unknown) {
              showAlert(
                "Could Not Delete",
                getApiErrorMessage(error, "The mission schedule could not be deleted.")
              );
            } finally {
              setSaving(false);
            }
          },
        },
      ]);
    },
    [catalogue.selectedMissionId, closeEdit, revalidate, setSaving, setSelectedMissionId]
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
              await revalidate();
              if (catalogue.selectedMissionId) {
                await loadMissionDetail(catalogue.selectedMissionId);
              }
            } catch (error: unknown) {
              showAlert(
                "Could Not Decline",
                getApiErrorMessage(error, "The appointment could not be declined.")
              );
            }
          },
        },
      ]);
    },
    [catalogue.selectedMissionId, loadMissionDetail, revalidate]
  );

  return { deleteMission, declineAppointment };
};
