import { useCallback, useState } from "react";

import {
  createMissionSchedule,
  updateMissionSchedule,
  type MissionScheduleRecord,
} from "@/services/appointments";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

import { isEndAfterStart, toIsoDateKey } from "../../utils/dateTime";
import { hasMissionOnDate, missionCategorySelection } from "../../utils/missionCategories";
import type { MissionCatalogue } from "../useMissionCatalogue";
import type { MissionForm } from "../useMissionForm";
import { toast } from "@/components/feedback/toast/toastStore";

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
      toast.error("Select a service", "Enable at least one category.");
      return false;
    }
    if (hasMissionOnDate(missions, date)) {
      toast.error("Date already scheduled", "A mission schedule already exists for this date.");
      return false;
    }
    if (!isEndAfterStart(startTime, endTime)) {
      toast.error("Invalid time range", "End time must be after start time.");
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
      toast.success("Mission schedule created", "You can now assign patients from the queue.");
      return true;
    } catch (error: unknown) {
      toast.error("Unable to create schedule", getApiErrorMessage(error, "The mission schedule could not be created."));
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
      toast.error("Select a service", "Enable at least one category.");
      return;
    }
    if (!isEndAfterStart(startTime, endTime)) {
      toast.error("Invalid time range", "End time must be after start time.");
      return;
    }
    if (hasMissionOnDate(missions, date, editMissionId)) {
      toast.error("Date already scheduled", "A mission schedule already exists for this date.");
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
      toast.success("Mission schedule updated");
    } catch (error: unknown) {
      toast.error("Unable to update schedule", getApiErrorMessage(error, "The mission schedule could not be updated."));
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
