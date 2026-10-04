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
import { useRealtimeEvents } from "@/hooks/realtime/useRealtimeEvents";
import { useRealtimeRefetch } from "@/hooks/realtime/useRealtimeRefetch";
import { removeItem, upsertItem } from "@/lib/realtime/collectionReducer";
import { toastError } from "@/utils/errorToast/toastError";

const missionId = (mission: MissionScheduleRecord) => mission._id;

// GET /mission-schedule's order: latest mission day first.
const latestDayFirst = (a: MissionScheduleRecord, b: MissionScheduleRecord) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

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
      toastError("Unable to load missions", error, { fallback: "Could not load mission data." });
    }
  }, []);

  const loadMissionDetail = useCallback(async (missionId: string) => {
    try {
      setMissionDetail(await fetchMissionDetail(missionId));
      setAnalytics(await fetchCategoryAnalytics(missionId));
    } catch (error: unknown) {
      toastError("Unable to load schedule", error, { fallback: "Could not load this mission schedule." });
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

  // Another manager adding, moving or removing a mission day shows here at once.
  useRealtimeEvents("missionSchedule", (change) => {
    if (change.action === "resync") return;
    if (change.action === "deleted") {
      setMissions((current) => removeItem(current, change.id, missionId));
      setSelectedMissionId((selected) => (selected === change.id ? null : selected));
      return;
    }
    setMissions((current) => upsertItem(current, change.record, { getId: missionId, sort: latestDayFirst }));
  });

  // Pending requests, the open mission's bookings and its analytics are server
  // computed, so a booking or a slot change anywhere reloads them.
  useRealtimeRefetch(["appointment", "missionSchedule"], () =>
    Promise.all([refreshLists(), selectedMissionId ? loadMissionDetail(selectedMissionId) : undefined])
  );

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
