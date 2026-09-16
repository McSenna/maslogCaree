import { useCallback, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { canAssignAppointments, canCreateMission } from "@/config/healthcareRoles";
import { useAppointmentCompletion } from "@/hooks/useAppointmentCompletion";
import { catalogueDefaults } from "../utils/missionCategories";
import { sortMissionTimeline } from "../utils/slotLabels";
import { useMissionActions } from "./useMissionActions";
import { useMissionCatalogue } from "./useMissionCatalogue";
import { useMissionDateTimePicker } from "./useMissionDateTimePicker";
import { useMissionForm } from "./useMissionForm";
import { useQueueDashboard } from "@/hooks/useQueueDashboard";
import { useSlotAssignment } from "./useSlotAssignment";

const todayDateKey = () => new Date().toISOString().slice(0, 10);

export const useMissionControl = () => {
  const { user } = useAuth();

  const dashboard = useQueueDashboard();
  const catalogue = useMissionCatalogue();
  const createForm = useMissionForm(todayDateKey());
  const editForm = useMissionForm(todayDateKey());
  const picker = useMissionDateTimePicker();

  const { categories, missions, selectedMissionId, refreshLists, loadMissionDetail } = catalogue;

  const actions = useMissionActions({
    catalogue,
    createForm,
    editForm,
    onDashboardChanged: dashboard.refreshAll,
  });

  const handleAssigned = useCallback(
    async (missionId: string) => {
      await refreshLists();
      await dashboard.refreshAll();
      await loadMissionDetail(missionId);
    },
    [refreshLists, dashboard, loadMissionDetail]
  );

  const assignment = useSlotAssignment({
    selectedMissionId,
    categories,
    setSaving: actions.setSaving,
    onAssigned: handleAssigned,
  });

  const completion = useAppointmentCompletion({
    onCompleted: async () => {
      await dashboard.refreshAll();
    },
  });

  const { mergeDefaults } = createForm;
  useEffect(() => {
    mergeDefaults(catalogueDefaults(categories));
  }, [categories, mergeDefaults]);

  const serviceLabels = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.key, category.label])),
    [categories]
  );

  const scopeDescription = useMemo(() => {
    const names = (dashboard.overview?.breakdown ?? []).map((row) => row.label);
    if (!names.length) return "Appointments assigned to your services.";
    return `Your services: ${names.join(" · ")}`;
  }, [dashboard.overview]);

  const scopeEmptyMessage = useMemo(() => {
    const names = (dashboard.overview?.breakdown ?? []).map((row) => row.label);
    if (!names.length) return "Nothing is assigned to your services yet.";
    return `No ${names.join(" or ")} appointments to show.`;
  }, [dashboard.overview]);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  const selectedMission = useMemo(
    () => missions.find((mission) => mission._id === selectedMissionId) ?? null,
    [missions, selectedMissionId]
  );

  const timeline = useMemo(
    () => sortMissionTimeline(catalogue.missionDetail?.bookedAppointments ?? []),
    [catalogue.missionDetail]
  );

  return {
    dashboard,
    catalogue,
    actions,
    assignment,
    completion,
    createForm,
    editForm,
    picker,
    selectedMission,
    timeline,
    serviceLabels,
    scopeDescription,
    scopeEmptyMessage,
    todayLabel,
    canManageMissions: canCreateMission(user?.role),
    canAct: canAssignAppointments(user?.role),
  };
};

export type MissionControl = ReturnType<typeof useMissionControl>;
