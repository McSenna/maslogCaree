import { useCallback, useEffect, useRef, useState } from "react";
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
import { useLatestRef } from "@/hooks/useLatestRef";
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

  // Saves reload in the background while realtime reloads the same views, so
  // only the newest request may write: an older response landing late would
  // put stale rows back on screen.
  const listsRequest = useRef(0);
  const detailRequest = useRef(0);
  const selectedRef = useLatestRef(selectedMissionId);

  const refreshLists = useCallback(async () => {
    const request = ++listsRequest.current;
    try {
      const [nextCategories, nextMissions, nextPending] = await Promise.all([
        fetchConsultationCategories(),
        fetchMissionSchedules(),
        fetchPendingAppointments(),
      ]);
      if (request !== listsRequest.current) return;
      setCategories(nextCategories);
      setMissions(nextMissions);
      setPending(nextPending);
    } catch (error: unknown) {
      if (request !== listsRequest.current) return;
      toastError("Unable to load missions", error, { fallback: "Could not load mission data." });
    }
  }, []);

  const loadMissionDetail = useCallback(
    async (missionId: string) => {
      const request = ++detailRequest.current;
      try {
        const [detail, nextAnalytics] = await Promise.all([
          fetchMissionDetail(missionId),
          fetchCategoryAnalytics(missionId),
        ]);
        if (request !== detailRequest.current || selectedRef.current !== missionId) return;
        setMissionDetail(detail);
        setAnalytics(nextAnalytics);
      } catch (error: unknown) {
        // A mission deleted or deselected meanwhile is not an error the user needs to see.
        if (request !== detailRequest.current || selectedRef.current !== missionId) return;
        toastError("Unable to load schedule", error, { fallback: "Could not load this mission schedule." });
      }
    },
    [selectedRef]
  );

  /** Puts a mission the server just returned on screen, the same way a realtime update does. */
  const applyMission = useCallback(
    (mission: MissionScheduleRecord) =>
      setMissions((current) => upsertItem(current, mission, { getId: missionId, sort: latestDayFirst })),
    []
  );

  const removeMission = useCallback((id: string) => {
    setMissions((current) => removeItem(current, id, missionId));
    setSelectedMissionId((selected) => (selected === id ? null : selected));
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
    if (change.action === "deleted") removeMission(change.id);
    else applyMission(change.record);
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
    applyMission,
    removeMission,
  };
};

export type MissionCatalogue = ReturnType<typeof useMissionCatalogue>;
