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
import { todayDateKey } from "@/utils/dateFormatter";
import type { AppointmentRecord } from "@/services/appointments";
import { isWeeklyService } from "@/utils/serviceDays";
import { useSlotAssignment, type AssignMode } from "./useSlotAssignment";
import { useWeeklyPlacement } from "./useWeeklyPlacement";

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

  // Mission slots are for mission services only; the categories here feed the mission editor and slot dialog.
  const missionCategories = useMemo(() => categories.filter((category) => !isWeeklyService(category.key)), [categories]);

  const assignment = useSlotAssignment({
    selectedMissionId,
    categories: missionCategories,
    setSaving: actions.setSaving,
    onAssigned: handleAssigned,
  });

  const placeWeekly = useWeeklyPlacement({
    setSaving: actions.setSaving,
    onPlaced: async () => {
      await refreshLists();
      await dashboard.refreshAll();
    },
  });

  /** Immunization is placed on its own Wednesday schedule; everything else opens the mission slot dialog. */
  const openAssign = useCallback(
    (appointment: AppointmentRecord, mode: AssignMode) =>
      isWeeklyService(appointment.consultationType) ? void placeWeekly(appointment, mode) : assignment.openFor(appointment, mode),
    [assignment, placeWeekly]
  );

  const completion = useAppointmentCompletion({
    onCompleted: async () => {
      await dashboard.refreshAll();
    },
  });

  const { mergeDefaults } = createForm;
  useEffect(() => {
    mergeDefaults(catalogueDefaults(missionCategories));
  }, [missionCategories, mergeDefaults]);

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
    openAssign,
    missionCategories,
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
