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
import { toast } from "@/components/feedback/toast/toastStore";

export type CategoryAnalyticsRow = {
  _id: { category: string; status: string };
  count: number;
};

type MissionDetail = {
  missionSchedule: MissionScheduleRecord;
  bookedAppointments: AppointmentRecord[];
};

export const useMissionCatalogue = () => {
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
      toast.error("Unable to load missions", getApiErrorMessage(error, "Could not load mission data."));
    }
  }, []);

  const loadMissionDetail = useCallback(async (missionId: string) => {
    try {
      setMissionDetail(await fetchMissionDetail(missionId));
      setAnalytics(await fetchCategoryAnalytics(missionId));
    } catch (error: unknown) {
      toast.error("Unable to load schedule", getApiErrorMessage(error, "Could not load this mission schedule."));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
    void refreshLists();
  }, [refreshLists]);

  useEffect(() => {
    if (selectedMissionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch synchronizing with the API
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
};

export type MissionCatalogue = ReturnType<typeof useMissionCatalogue>;
