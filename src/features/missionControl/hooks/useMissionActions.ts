import { useCallback, useState } from "react";
import {
  createMissionSchedule,
  deleteMissionSchedule,
  rejectAppointment,
  updateMissionSchedule,
  type AppointmentRecord,
  type MissionScheduleRecord,
} from "@/services/appointments";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { showAlert } from "@/utils/notify";
import { isEndAfterStart, toIsoDateKey } from "../utils/dateTime";
import { hasMissionOnDate, missionCategorySelection } from "../utils/missionCategories";
import type { MissionCatalogue } from "./useMissionCatalogue";
import type { MissionForm } from "./useMissionForm";

type MissionActionsInput = {
  catalogue: MissionCatalogue;
  createForm: MissionForm;
  editForm: MissionForm;
  /** Revalidates the queue dashboard once the server has confirmed a change. */
  onDashboardChanged: () => Promise<void>;
};

/**
 * Every write the mission workspace performs: creating a schedule, editing
 * one, deleting one, and declining a queued request.
 *
 * The validation here is a courtesy, not the rule. The server rejects an empty
 * category list, an inverted time range and a second schedule on the same day
 * regardless; checking first means the health worker is told before losing the
 * form they filled in.
 */
export function useMissionActions({
  catalogue,
  createForm,
  editForm,
  onDashboardChanged,
}: MissionActionsInput) {
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editMissionId, setEditMissionId] = useState<string | null>(null);

  const { categories, missions, refreshLists, loadMissionDetail, setSelectedMissionId } = catalogue;

  /** Re-reads the workspace lists and the dashboard after a confirmed write. */
  const revalidate = useCallback(async () => {
    await refreshLists();
    await onDashboardChanged();
  }, [refreshLists, onDashboardChanged]);

  const createMission = useCallback(async () => {
    const categoriesPayload = createForm.toPayload(categories);
    const { date, startTime, endTime } = createForm.values;

    if (!categoriesPayload.length) {
      showAlert("Categories", "Enable at least one category.");
      return;
    }
    if (hasMissionOnDate(missions, date)) {
      showAlert("Error", "A mission schedule already exists for this date.");
      return;
    }
    if (!isEndAfterStart(startTime, endTime)) {
      showAlert("Invalid time range", "End time must be after start time.");
      return;
    }

    setSaving(true);
    try {
      const created = await createMissionSchedule({
        date,
        startTime,
        endTime,
        categories: categoriesPayload,
      });
      await revalidate();
      // Selecting the new schedule loads its detail through the catalogue's
      // own effect, so the health worker can assign into it immediately.
      if (created?._id) setSelectedMissionId(created._id);
      showAlert("Created", "Mission schedule saved. You can assign patients from the queue.");
    } catch (error: unknown) {
      showAlert(
        "Could Not Create",
        getApiErrorMessage(error, "The mission schedule could not be created.")
      );
    } finally {
      setSaving(false);
    }
  }, [categories, createForm, missions, revalidate, setSelectedMissionId]);

  const openEdit = useCallback(
    (mission: MissionScheduleRecord) => {
      setEditMissionId(mission._id);
      setEditOpen(true);
      editForm.reset({
        values: {
          date: toIsoDateKey(new Date(mission.date)),
          startTime: mission.morningStart,
          endTime: mission.morningEnd,
        },
        ...missionCategorySelection(mission, categories),
      });
    },
    [categories, editForm]
  );

  const closeEdit = useCallback(() => setEditOpen(false), []);

  const saveEdit = useCallback(async () => {
    if (!editMissionId) return;

    const categoriesPayload = editForm.toPayload(categories);
    const { date, startTime, endTime } = editForm.values;

    if (!categoriesPayload.length) {
      showAlert("Categories", "Enable at least one category.");
      return;
    }
    if (!isEndAfterStart(startTime, endTime)) {
      showAlert("Invalid time range", "End time must be after start time.");
      return;
    }
    if (hasMissionOnDate(missions, date, editMissionId)) {
      showAlert("Error", "A mission schedule already exists for this date.");
      return;
    }

    setSaving(true);
    try {
      await updateMissionSchedule(editMissionId, {
        date,
        startTime,
        endTime,
        categories: categoriesPayload,
      });
      setEditOpen(false);
      await revalidate();
      // Re-read explicitly: the edited schedule is usually the selected one
      // already, so selecting it again would not reload its detail.
      setSelectedMissionId(editMissionId);
      await loadMissionDetail(editMissionId);
      showAlert("Saved", "Mission schedule updated.");
    } catch (error: unknown) {
      showAlert(
        "Could Not Update",
        getApiErrorMessage(error, "The mission schedule could not be updated.")
      );
    } finally {
      setSaving(false);
    }
  }, [
    categories,
    editForm,
    editMissionId,
    loadMissionDetail,
    missions,
    revalidate,
    setSelectedMissionId,
  ]);

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
              // Clearing the selection empties the detail panels through the
              // catalogue's effect.
              if (catalogue.selectedMissionId === missionId) setSelectedMissionId(null);
              setEditOpen(false);
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
    [catalogue.selectedMissionId, revalidate, setSelectedMissionId]
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

  return {
    saving,
    setSaving,
    editOpen,
    openEdit,
    closeEdit,
    createMission,
    saveEdit,
    deleteMission,
    declineAppointment,
  };
}
