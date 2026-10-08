import { useCallback, useState } from "react";

import { useLatestRef } from "@/hooks/useLatestRef";

import type { MissionCatalogue } from "./useMissionCatalogue";
import type { MissionForm } from "./useMissionForm";
import { useMissionRemovalActions } from "./actions/useMissionRemovalActions";
import { useMissionSaveActions } from "./actions/useMissionSaveActions";

type MissionActionsInput = {
  catalogue: MissionCatalogue;
  createForm: MissionForm;
  editForm: MissionForm;
  onDashboardChanged: () => Promise<void>;
};

export const useMissionActions = ({
  catalogue,
  createForm,
  editForm,
  onDashboardChanged,
}: MissionActionsInput) => {
  const [saving, setSaving] = useState(false);
  const { refreshLists, loadMissionDetail, selectedMissionId } = catalogue;
  const selectedRef = useLatestRef(selectedMissionId);

  /**
   * Brings every server-computed view on this screen up to date after a save.
   * Callers start it after the server has confirmed and the result is already
   * on screen, and do not wait for it: the toast, the closing modal and the
   * button never hold on these reloads.
   */
  const revalidate = useCallback(async () => {
    const selected = selectedRef.current;
    await Promise.all([refreshLists(), onDashboardChanged(), selected ? loadMissionDetail(selected) : undefined]);
  }, [refreshLists, onDashboardChanged, loadMissionDetail, selectedRef]);

  const { editOpen, editMissionId, openEdit, closeEdit, createMission, saveEdit } =
    useMissionSaveActions({ catalogue, createForm, editForm, revalidate, setSaving });

  const { deleteMission, declineAppointment } = useMissionRemovalActions({
    catalogue,
    revalidate,
    setSaving,
    closeEdit,
  });

  return {
    saving,
    setSaving,
    editOpen,
    editMissionId,
    openEdit,
    closeEdit,
    createMission,
    saveEdit,
    deleteMission,
    declineAppointment,
  };
};
