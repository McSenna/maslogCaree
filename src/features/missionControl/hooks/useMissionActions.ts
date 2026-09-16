import { useCallback, useState } from "react";

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
  const { refreshLists } = catalogue;

  const revalidate = useCallback(async () => {
    await refreshLists();
    await onDashboardChanged();
  }, [refreshLists, onDashboardChanged]);

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
