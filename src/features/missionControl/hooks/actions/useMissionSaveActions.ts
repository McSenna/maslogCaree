import { useCallback, useState } from "react";

import {
  createMissionSchedule,
  updateMissionSchedule,
  type MissionScheduleRecord,
} from "@/services/appointments";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { showAlert } from "@/utils/notify";

import { isEndAfterStart, toIsoDateKey } from "../../utils/dateTime";
import { hasMissionOnDate, missionCategorySelection } from "../../utils/missionCategories";
import type { MissionCatalogue } from "../useMissionCatalogue";
import type { MissionForm } from "../useMissionForm";

type Input = {
  catalogue: MissionCatalogue;
  createForm: MissionForm;
  editForm: MissionForm;
  revalidate: () => Promise<void>;
  setSaving: (saving: boolean) => void;
};

export const useMissionSaveActions = ({
  catalogue,
  createForm,
  editForm,
  revalidate,
  setSaving,
}: Input) => {
  const [editOpen, setEditOpen] = useState(false);
  const [editMissionId, setEditMissionId] = useState<string | null>(null);

  const { categories, missions, loadMissionDetail, setSelectedMissionId } = catalogue;

  const createMission = useCallback(async (): Promise<boolean> => {
    const categoriesPayload = createForm.toPayload(categories);
    const { date, startTime, endTime } = createForm.values;

    if (!categoriesPayload.length) {
      showAlert("Categories", "Enable at least one category.");
      return false;
    }
    if (hasMissionOnDate(missions, date)) {
      showAlert("Error", "A mission schedule already exists for this date.");
      return false;
    }
    if (!isEndAfterStart(startTime, endTime)) {
      showAlert("Invalid time range", "End time must be after start time.");
      return false;
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
      if (created?._id) setSelectedMissionId(created._id);
      showAlert("Created", "Mission schedule saved. You can assign patients from the queue.");
      return true;
    } catch (error: unknown) {
      showAlert(
        "Could Not Create",
        getApiErrorMessage(error, "The mission schedule could not be created.")
      );
      return false;
    } finally {
      setSaving(false);
    }
  }, [categories, createForm, missions, revalidate, setSaving, setSelectedMissionId]);

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
    setSaving,
    setSelectedMissionId,
  ]);

  return { editOpen, editMissionId, openEdit, closeEdit, createMission, saveEdit };
};
