import { useCallback, useEffect, useState } from "react";
import {
  fetchCategoryAnalytics,
  fetchConsultationCategories,
  fetchMissionDetail,
  fetchMissionSchedules,
  fetchPendingAppointments,
  type AppointmentRecord,
  type ConsultationCategory,
  type MissionScheduleRecord,
} from "@/services/appointments";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { showAlert } from "@/utils/notify";

/** One row of the per-mission analytics the server aggregates. */
export type CategoryAnalyticsRow = {
  _id: { category: string; status: string };
  count: number;
};

type MissionDetail = {
  missionSchedule: MissionScheduleRecord;
  bookedAppointments: AppointmentRecord[];
};

/**
 * Everything the mission scheduling workspace reads: the service catalogue,
 * the existing schedules, the priority queue waiting for slots, and the detail
 * of whichever schedule is selected.
 *
 * Reads only. The writes live in `useMissionActions`, which calls back into
 * `refreshLists` here once the server has confirmed a change — so this hook
 * never has to know which operation invalidated it.
 */
export function useMissionCatalogue() {
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);
  const [missions, setMissions] = useState<MissionScheduleRecord[]>([]);
  const [pending, setPending] = useState<AppointmentRecord[]>([]);

  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [missionDetail, setMissionDetail] = useState<MissionDetail | null>(null);
  const [analytics, setAnalytics] = useState<CategoryAnalyticsRow[]>([]);

  const refreshLists = useCallback(async () => {
    try {
      const [nextCategories, nextMissions, nextPending] = await Promise.all([
        fetchConsultationCategories(),
        fetchMissionSchedules(),
        fetchPendingAppointments(),
      ]);
      setCategories(nextCategories);
      setMissions(nextMissions);
      setPending(nextPending);
    } catch (error: unknown) {
      showAlert("Unable to Load", getApiErrorMessage(error, "Could not load mission data."));
    }
  }, []);

  const loadMissionDetail = useCallback(async (missionId: string) => {
    try {
      setMissionDetail(await fetchMissionDetail(missionId));
      setAnalytics(await fetchCategoryAnalytics(missionId));
    } catch (error: unknown) {
      showAlert(
        "Unable to Load",
        getApiErrorMessage(error, "Could not load this mission schedule.")
      );
    }
  }, []);

  useEffect(() => {
    void refreshLists();
  }, [refreshLists]);

  /** The detail panels follow the selection rather than each caller clearing them. */
  useEffect(() => {
    if (selectedMissionId) {
      void loadMissionDetail(selectedMissionId);
    } else {
      setMissionDetail(null);
      setAnalytics([]);
    }
  }, [selectedMissionId, loadMissionDetail]);

  return {
    categories,
    missions,
    pending,
    selectedMissionId,
    setSelectedMissionId,
    missionDetail,
    analytics,
    refreshLists,
    loadMissionDetail,
  };
}

export type MissionCatalogue = ReturnType<typeof useMissionCatalogue>;
