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

/** The create form opens on today, in the same UTC day key the API stores. */
const todayDateKey = () => new Date().toISOString().slice(0, 10);

/**
 * The Appointment & Queue screen's whole data layer, in one place.
 *
 * The screen below it renders panels and nothing else. The pieces are separate
 * hooks because they fail and reload independently — the dashboard can be
 * showing an error while the mission workspace is fine — and this composes
 * them so the screen never has to wire six hooks together itself.
 */
export function useMissionControl() {
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

  /**
   * After an assignment the appointment leaves Pending, joins the queue and
   * lands in the mission's timeline, so all three are re-read.
   */
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

  /**
   * After a completion the patient leaves the queue and lands under Completed,
   * and the header figures move. All of it is re-read from the server rather
   * than patched locally: the counts are computed there, and a client that
   * recomputed them would only be guessing at the same numbers.
   */
  const completion = useAppointmentCompletion({
    onCompleted: async () => {
      await dashboard.refreshAll();
    },
  });

  /**
   * Seeds the create form as services arrive, without discarding a selection
   * made while the catalogue was being re-read.
   */
  const { mergeDefaults } = createForm;
  useEffect(() => {
    mergeDefaults(catalogueDefaults(categories));
  }, [categories, mergeDefaults]);

  /** Service key → approved display name, straight from the server catalogue. */
  const serviceLabels = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.key, category.label])),
    [categories]
  );

  /**
   * What this role is responsible for, in their own words.
   *
   * Read from the catalogue the server sent rather than a local list, so the
   * sentence can never name a service the API would not actually return.
   */
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
    /**
     * Presentation only — `POST /mission-schedule` refuses a midwife or a BHW
     * with a 403 whether or not the Add Mission control was ever rendered.
     */
    canManageMissions: canCreateMission(user?.role),
    /**
     * Whether this role may act on a row. A BHW reads their own BP Checking
     * queue but cannot schedule or decline it, so their rows carry no controls
     * — the same rule the API applies.
     */
    canAct: canAssignAppointments(user?.role),
  };
}

export type MissionControl = ReturnType<typeof useMissionControl>;
