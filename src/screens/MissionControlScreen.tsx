import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  Platform,
  View,
  useWindowDimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import {
  assignAppointment,
  createMissionSchedule,
  deleteMissionSchedule,
  fetchAvailableSlots,
  fetchCategoryAnalytics,
  fetchConsultationCategories,
  fetchMissionDetail,
  fetchMissionSchedules,
  fetchPendingAppointments,
  updateMissionSchedule,
  reassignAppointment,
  rejectAppointment,
  suggestNextSlot,
  type AppointmentRecord,
  type ConsultationCategory,
  type MissionScheduleRecord,
  fetchAppointmentsByStatus,
  fetchQueueOverview,
  type QueueOverview,
} from "@/services/appointments";

import { useAuth } from "@/contexts/AuthContext";
import { canAssignAppointments, canCreateMission } from "@/config/healthcareRoles";
import AppointmentsPanel from "@/components/appointmentQueue/AppointmentsPanel";
import QueueStatCards from "@/components/appointmentQueue/QueueStatCards";
import ServiceBreakdownPanel from "@/components/appointmentQueue/ServiceBreakdownPanel";
import TodaySchedulePanel from "@/components/appointmentQueue/TodaySchedulePanel";
import {
  FOUR_CARD_WIDTH,
  TABLE_WIDTH,
  TWO_COLUMN_WIDTH,
  useQueuePalette,
  type AppointmentStatus,
} from "@/components/appointmentQueue/queueTheme";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { showAlert } from "@/utils/notify";
const defaultTime = { start: "08:00", end: "12:00" };

function formatSlotLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function tierLabel(tier?: number) {
  if (tier === 0) return "P0 (0–1: Critical)";
  if (tier === 1) return "P1 (60+: Elderly)";
  if (tier === 2) return "P2 (2–12: Children)";
  if (tier === 3) return "P3 (13–17: Teenagers)";
  if (tier === 4) return "P4 (18–59: Adults)";
  return "—";
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function dateToYYYYMMDD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function hhmmToMinutes(hhmm: string) {
  const [hRaw, mRaw] = String(hhmm).split(":");
  const h = Number(hRaw);
  const m = Number(mRaw);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;
  return h * 60 + m;
}

function formatHHMM(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export default function MissionControlScreen() {
  const [categories, setCategories] = useState<ConsultationCategory[]>([]);
  const [missions, setMissions] = useState<MissionScheduleRecord[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [missionDetail, setMissionDetail] = useState<{
    missionSchedule: MissionScheduleRecord;
    bookedAppointments: AppointmentRecord[];
  } | null>(null);
  const [pending, setPending] = useState<AppointmentRecord[]>([]);
  const [analytics, setAnalytics] = useState<
    { _id: { category: string; status: string }; count: number }[]
  >([]);
  const [saving, setSaving] = useState(false);

  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState(defaultTime.start);
  const [endTime, setEndTime] = useState(defaultTime.end);
  const [enabledCatKeys, setEnabledCatKeys] = useState<Record<string, boolean>>({});
  const [catDurations, setCatDurations] = useState<Record<string, number>>({});

  // Edit form state.
  const [editOpen, setEditOpen] = useState(false);
  const [editMissionId, setEditMissionId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState(newDate);
  const [editStartTime, setEditStartTime] = useState(defaultTime.start);
  const [editEndTime, setEditEndTime] = useState(defaultTime.end);
  const [editEnabledCatKeys, setEditEnabledCatKeys] = useState<Record<string, boolean>>({});
  const [editCatDurations, setEditCatDurations] = useState<Record<string, number>>({});

  // Shared date/time picker (create or edit).
  const [pickerContext, setPickerContext] = useState<"create" | "edit" | null>(null);
  const [pickerTarget, setPickerTarget] = useState<"date" | "start" | "end" | null>(null);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<AppointmentRecord | null>(null);
  const [assignMode, setAssignMode] = useState<"assign" | "reassign">("assign");
  const [assignCategory, setAssignCategory] = useState<string>("");
  const [assignDuration, setAssignDuration] = useState<string>("");
  const [assignSlots, setAssignSlots] = useState<string[]>([]);
  const [assignSelectedSlot, setAssignSelectedSlot] = useState<string | null>(null);
  const [assignLoadingSlots, setAssignLoadingSlots] = useState(false);

  const palette = useQueuePalette();
  const { user } = useAuth();
  const { width } = useWindowDimensions();

  const isPhone = width < 768;
  const twoColumn = width >= TWO_COLUMN_WIDTH;
  const asTable = width >= TABLE_WIDTH;
  const fourCards = width >= FOUR_CARD_WIDTH;

  /**
   * Whether to draw the Add Mission control.
   *
   * Presentation only — `POST /mission-schedule` refuses a midwife or a BHW
   * with a 403 whether or not the button was ever rendered.
   */
  const showAddMission = canCreateMission(user?.role);

  /**
   * Whether this role may act on a row.
   *
   * A BHW reads their own BP Checking queue but cannot schedule or decline it,
   * so their rows carry no controls — the same rule the API applies.
   */
  const canAct = canAssignAppointments(user?.role);

  const [overview, setOverview] = useState<QueueOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<AppointmentStatus>("pending");
  const [statusList, setStatusList] = useState<AppointmentRecord[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [missionToolsOpen, setMissionToolsOpen] = useState(false);

  /** Service key → approved display name, straight from the server catalogue. */
  const serviceLabels = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.key, c.label])),
    [categories]
  );

  /**
   * What this role is responsible for, in their own words.
   *
   * Read from the catalogue the server sent rather than a local list, so the
   * sentence can never name a service the API would not actually return.
   */
  const scopeDescription = useMemo(() => {
    const names = (overview?.breakdown ?? []).map((row) => row.label);
    if (!names.length) return "Appointments assigned to your services.";
    return `Your services: ${names.join(" · ")}`;
  }, [overview]);

  const scopeEmptyMessage = useMemo(() => {
    const names = (overview?.breakdown ?? []).map((row) => row.label);
    if (!names.length) return "Nothing is assigned to your services yet.";
    return `No ${names.join(" or ")} appointments to show.`;
  }, [overview]);

  const todayLabel = useMemo(
    () => new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    []
  );

  const visibleAppointments = statusList;

  const selectedMission = useMemo(
    () => missions.find((m) => m._id === selectedMissionId) ?? null,
    [missions, selectedMissionId]
  );

  const refreshLists = useCallback(async () => {
    try {
      const [cats, ms, pend] = await Promise.all([
        fetchConsultationCategories(),
        fetchMissionSchedules(),
        fetchPendingAppointments(),
      ]);
      setCategories(cats);
      setMissions(ms);
      setPending(pend);
      const nextEnabled: Record<string, boolean> = {};
      const nextDurations: Record<string, number> = {};
      for (const c of cats) {
        nextEnabled[c.key] = true;
        if (typeof c.durationMinutes === "number") nextDurations[c.key] = c.durationMinutes;
        else nextDurations[c.key] = c.durationMinutesMin ?? 15;
      }
      setEnabledCatKeys((prev) => ({ ...nextEnabled, ...prev }));
      setCatDurations((prev) => ({ ...nextDurations, ...prev }));
    } catch (e: unknown) {
      showAlert("Unable to Load", getApiErrorMessage(e, "Could not load mission data."));
    }
  }, []);

  const loadMissionDetail = useCallback(async (id: string) => {
    try {
      const detail = await fetchMissionDetail(id);
      setMissionDetail(detail);
      const an = await fetchCategoryAnalytics(id);
      setAnalytics(an);
    } catch (e: unknown) {
      showAlert(
        "Unable to Load",
        getApiErrorMessage(e, "Could not load this mission schedule.")
      );
    }
  }, []);

  useEffect(() => {
    void refreshLists();
  }, [refreshLists]);

  /**
   * The header figures, today's schedule and the breakdown.
   *
   * One request, all of it counted server-side against this role's own
   * services — the client never sees another queue's records to filter out.
   */
  const loadOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      setOverview(await fetchQueueOverview());
    } catch {
      // The panels fall back to their empty states; the appointments list
      // carries the visible error so the screen reports one problem, not three.
      setOverview(null);
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  /** The table's rows for whichever tab is selected. */
  const loadStatusList = useCallback(async (status: AppointmentStatus) => {
    setListLoading(true);
    setListError(null);
    try {
      setStatusList(await fetchAppointmentsByStatus(status));
    } catch (e: unknown) {
      setStatusList([]);
      setListError(getApiErrorMessage(e, "The appointment list could not be loaded."));
    } finally {
      setListLoading(false);
    }
  }, []);

  /** Re-reads everything the dashboard shows, after an appointment changes. */
  const refreshDashboard = useCallback(async () => {
    await Promise.all([loadOverview(), loadStatusList(activeStatus)]);
  }, [loadOverview, loadStatusList, activeStatus]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    void loadStatusList(activeStatus);
  }, [activeStatus, loadStatusList]);

  useEffect(() => {
    if (selectedMissionId) {
      void loadMissionDetail(selectedMissionId);
    } else {
      setMissionDetail(null);
      setAnalytics([]);
    }
  }, [selectedMissionId, loadMissionDetail]);

  const openAssign = (appt: AppointmentRecord, mode: "assign" | "reassign") => {
    setAssignTarget(appt);
    setAssignMode(mode);
    setAssignCategory(appt.consultationType || "");
    setAssignDuration("");
    setAssignSlots([]);
    setAssignSelectedSlot(null);
    setAssignOpen(true);
  };

  const loadSlotsForAssign = async () => {
    if (!selectedMissionId || !assignCategory) {
      showAlert("Select mission", "Choose a mission schedule first, then a category.");
      return;
    }
    const cat = categories.find((c) => c.key === assignCategory);
    const durParam =
      cat?.durationMinutesMin != null && assignDuration
        ? Number(assignDuration)
        : undefined;

    setAssignLoadingSlots(true);
    try {
      const suggested = await suggestNextSlot(
        selectedMissionId,
        assignCategory,
        durParam,
        assignMode === "reassign" ? assignTarget?._id : undefined
      );
      const pack = await fetchAvailableSlots(
        selectedMissionId,
        assignCategory,
        durParam,
        assignMode === "reassign" ? assignTarget?._id : undefined
      );
      setAssignSlots(pack.availableSlotStarts);
      if (suggested) {
        setAssignSelectedSlot(suggested);
      } else if (pack.suggestedNextSlotStart) {
        setAssignSelectedSlot(pack.suggestedNextSlotStart);
      }
      if (pack.durationMinutes && !assignDuration) {
        setAssignDuration(String(pack.durationMinutes));
      }
    } catch (e: unknown) {
      showAlert("Slots", getApiErrorMessage(e, "Could not load available time slots."));
    } finally {
      setAssignLoadingSlots(false);
    }
  };

  const submitAssign = async () => {
    if (!assignTarget || !selectedMissionId || !assignSelectedSlot || !assignCategory) {
      showAlert("Incomplete", "Choose category and time slot.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        missionScheduleId: selectedMissionId,
        categoryKey: assignCategory,
        slotStart: assignSelectedSlot,
        durationMinutes: assignDuration ? Number(assignDuration) : undefined,
      };
      if (assignMode === "assign") {
        await assignAppointment(assignTarget._id, body);
      } else {
        await reassignAppointment(assignTarget._id, body);
      }
      setAssignOpen(false);
      await refreshLists();
      await refreshDashboard();
      await loadMissionDetail(selectedMissionId);
      showAlert("Saved", assignMode === "assign" ? "Appointment confirmed." : "Appointment rescheduled.");
    } catch (e: unknown) {
      showAlert(
        "Could Not Save",
        getApiErrorMessage(e, "The appointment could not be scheduled.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCreateMission = async () => {
    const catsPayload = categories
      .filter((c) => enabledCatKeys[c.key])
      .map((c) => ({
        categoryKey: c.key,
        durationMinutes: catDurations[c.key] ?? (typeof c.durationMinutes === "number" ? c.durationMinutes : c.durationMinutesMin ?? 15),
      }));
    if (!catsPayload.length) {
      showAlert("Categories", "Enable at least one category.");
      return;
    }

    const hasDuplicateForDay = missions.some((m) => {
      const mDay = m.date ? new Date(m.date).toISOString().slice(0, 10) : "";
      return mDay === newDate;
    });
    if (hasDuplicateForDay) {
      showAlert("Error", "A mission schedule already exists for this date.");
      return;
    }

    const sMin = hhmmToMinutes(startTime);
    const eMin = hhmmToMinutes(endTime);
    if (Number.isFinite(sMin) && Number.isFinite(eMin) && eMin <= sMin) {
      showAlert("Invalid time range", "End time must be after start time.");
      return;
    }

    setSaving(true);
    try {
      const created = await createMissionSchedule({
        date: newDate,
        startTime,
        endTime,
        categories: catsPayload,
      });
      await refreshLists();
      await refreshDashboard();
      // Auto-select newly created schedule for a faster edit/assign workflow.
      if (created?._id) {
        setSelectedMissionId(created._id);
        await loadMissionDetail(created._id);
      }
      showAlert("Created", "Mission schedule saved. You can assign patients from the queue.");
    } catch (e: unknown) {
      showAlert(
        "Could Not Create",
        getApiErrorMessage(e, "The mission schedule could not be created.")
      );
    } finally {
      setSaving(false);
    }
  };

  const openEditMission = (mission: MissionScheduleRecord) => {
    setEditMissionId(mission._id);
    setEditOpen(true);
    setEditDate(dateToYYYYMMDD(new Date(mission.date)));
    setEditStartTime(mission.morningStart);
    setEditEndTime(mission.morningEnd);

    const missionCatMap = new Map((mission.categories || []).map((c) => [c.categoryKey, c.durationMinutes]));
    const nextEnabled: Record<string, boolean> = {};
    const nextDurations: Record<string, number> = {};

    for (const c of categories) {
      const inMission = missionCatMap.get(c.key);
      const enabled = inMission != null;
      nextEnabled[c.key] = enabled;
      nextDurations[c.key] =
        inMission ??
        (typeof c.durationMinutes === "number" ? c.durationMinutes : c.durationMinutesMin ?? 15);
    }

    setEditEnabledCatKeys(nextEnabled);
    setEditCatDurations(nextDurations);
    setPickerContext(null);
    setPickerTarget(null);
  };

  const handleSaveEdit = async () => {
    if (!editMissionId) return;

    const catsPayload = categories
      .filter((c) => editEnabledCatKeys[c.key])
      .map((c) => ({
        categoryKey: c.key,
        durationMinutes:
          editCatDurations[c.key] ?? (typeof c.durationMinutes === "number" ? c.durationMinutes : c.durationMinutesMin ?? 15),
      }));

    if (!catsPayload.length) {
      showAlert("Categories", "Enable at least one category.");
      return;
    }

    const sMin = hhmmToMinutes(editStartTime);
    const eMin = hhmmToMinutes(editEndTime);
    if (Number.isFinite(sMin) && Number.isFinite(eMin) && eMin <= sMin) {
      showAlert("Invalid time range", "End time must be after start time.");
      return;
    }

    // UI guard for the critical rule (backend also enforces).
    const hasDuplicateForDay = missions.some((m) => {
      const mDay = m.date ? new Date(m.date).toISOString().slice(0, 10) : "";
      return mDay === editDate && m._id !== editMissionId;
    });
    if (hasDuplicateForDay) {
      showAlert("Error", "A mission schedule already exists for this date.");
      return;
    }

    setSaving(true);
    try {
      await updateMissionSchedule(editMissionId, {
        date: editDate,
        startTime: editStartTime,
        endTime: editEndTime,
        categories: catsPayload,
      });
      setEditOpen(false);
      await refreshLists();
      await refreshDashboard();
      setSelectedMissionId(editMissionId);
      await loadMissionDetail(editMissionId);
      showAlert("Saved", "Mission schedule updated.");
    } catch (e: unknown) {
      showAlert(
        "Could Not Update",
        getApiErrorMessage(e, "The mission schedule could not be updated.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMission = async (missionId: string) => {
    showAlert("Delete schedule", "This will move any booked appointments back to Pending.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setSaving(true);
          try {
            await deleteMissionSchedule(missionId);
            await refreshLists();
            await refreshDashboard();
      await refreshDashboard();

            if (selectedMissionId === missionId) {
              setSelectedMissionId(null);
              setMissionDetail(null);
              setAnalytics([]);
            }

            setEditOpen(false);
            showAlert("Deleted", "Mission schedule removed.");
          } catch (e: unknown) {
            showAlert(
              "Could Not Delete",
              getApiErrorMessage(e, "The mission schedule could not be deleted.")
            );
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  const handleReject = (appt: AppointmentRecord) => {
    showAlert("Decline appointment", "Reject this queued request?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: async () => {
          try {
            await rejectAppointment(appt._id, "Declined by medical staff");
            await refreshLists();
            await refreshDashboard();
      await refreshDashboard();
            if (selectedMissionId) await loadMissionDetail(selectedMissionId);
          } catch (e: unknown) {
            showAlert(
              "Could Not Decline",
              getApiErrorMessage(e, "The appointment could not be declined.")
            );
          }
        },
      },
    ]);
  };

  const timeline = useMemo(() => {
    if (!missionDetail?.bookedAppointments?.length) return [];
    return [...missionDetail.bookedAppointments].sort((a, b) => {
      const ta = a.slotStart ? new Date(a.slotStart).getTime() : 0;
      const tb = b.slotStart ? new Date(b.slotStart).getTime() : 0;
      return ta - tb;
    });
  }, [missionDetail]);

  return (
    <View className="flex-1" style={{ backgroundColor: palette.pageBg }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: isPhone ? 14 : 20, paddingBottom: 40, gap: 16 }}
      >
        <View>
          <Text className="text-[22px] font-bold" style={{ color: palette.heading }}>
            Appointment &amp; Queue Management
          </Text>
          <Text className="mt-1 text-[13px]" style={{ color: palette.muted }}>
            {scopeDescription}
          </Text>
        </View>

        <QueueStatCards overview={overview} loading={overviewLoading} wide={fourCards} />

        {/* Two columns where there is room: the work on the left, the day and
            the caseload on the right. Below that they stack in the same order. */}
        <View className={`w-full gap-4 ${twoColumn ? "flex-row items-start" : "flex-col"}`}>
          <View className="min-w-0" style={twoColumn ? { flex: 2 } : undefined}>
            <AppointmentsPanel
              appointments={visibleAppointments}
              statusCounts={overview?.statusCounts ?? {}}
              activeStatus={activeStatus}
              onStatusChange={setActiveStatus}
              serviceLabels={serviceLabels}
              headerAction={
                showAddMission ? (
                  <Pressable
                    onPress={() => setMissionToolsOpen(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Add mission"
                    className="h-10 flex-row items-center gap-2 px-4"
                    style={{ borderRadius: 12, backgroundColor: palette.primary }}
                  >
                    <Feather name="plus" size={16} color="#FFFFFF" />
                    <Text className="text-[13.5px] font-semibold text-white">Add Mission</Text>
                  </Pressable>
                ) : null
              }
              onApprove={(appt) => openAssign(appt, "assign")}
              onMore={(appt) => openAssign(appt, appt.status === "pending" ? "assign" : "reassign")}
              busyId={saving ? assignTarget?._id ?? null : null}
              canAct={canAct}
              loading={listLoading}
              error={listError}
              onRetry={() => void refreshLists()}
              emptyMessage={scopeEmptyMessage}
            asTable={asTable}
            />
          </View>

          <View className="min-w-0 gap-4" style={twoColumn ? { flex: 1 } : undefined}>
            <TodaySchedulePanel
              schedule={overview?.schedule ?? []}
              serviceLabels={serviceLabels}
              loading={overviewLoading}
              emptyMessage={scopeEmptyMessage}
              dateLabel={todayLabel}
            />
            <ServiceBreakdownPanel rows={overview?.breakdown ?? []} loading={overviewLoading} />
          </View>
        </View>
      </ScrollView>

      {/* The mission workspace, unchanged and intact — creating a schedule,
          editing one, and assigning the priority queue into its slots. It moved
          behind the Add Mission control rather than being rebuilt, so none of
          the scheduling logic changed. Only roles that may manage a mission can
          open it, and the API refuses the rest regardless. */}
      <Modal
        visible={missionToolsOpen}
        transparent
        animationType={isPhone ? "slide" : "fade"}
        onRequestClose={() => setMissionToolsOpen(false)}
        statusBarTranslucent
      >
        <View
          className={`flex-1 ${isPhone ? "justify-end" : "items-center justify-center p-4"}`}
          style={{ backgroundColor: "rgba(15,37,87,0.35)" }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close mission scheduling"
            onPress={() => setMissionToolsOpen(false)}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          />

          <View
            className="w-full overflow-hidden"
            style={{
              maxWidth: isPhone ? undefined : 640,
              maxHeight: "92%",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderBottomLeftRadius: isPhone ? 0 : 24,
              borderBottomRightRadius: isPhone ? 0 : 24,
              backgroundColor: palette.panelBg,
            }}
          >
            {isPhone ? (
              <View className="items-center pb-1 pt-2.5">
                <View style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: palette.divider }} />
              </View>
            ) : null}

            <View
              className="flex-row items-center justify-between px-5 py-4"
              style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
            >
              <Text accessibilityRole="header" className="text-[17px] font-bold" style={{ color: palette.heading }}>
                Mission Scheduling
              </Text>
              <Pressable
                onPress={() => setMissionToolsOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Close mission scheduling"
                hitSlop={12}
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: palette.skeleton }}
              >
                <Feather name="x" size={17} color={palette.muted} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 20 }}>

        <View>
          <Text className="text-2xl font-bold text-slate-900">Mission & queue</Text>
          <Text className="mt-1 text-sm text-slate-600">
            Create a schedule first, then assign queued patients to validated time slots (no overlaps).
          </Text>
        </View>

        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">New mission schedule</Text>
          <Text className="mb-3 text-xs text-slate-500">
            Pick a mission date, choose a time range, then select categories.
          </Text>
          <Text className="text-xs font-semibold text-slate-600">Mission date</Text>
          <Pressable
            onPress={() => {
              setPickerContext("create");
              setPickerTarget("date");
            }}
            className="mt-1 flex-row items-center rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            <Feather name="calendar" size={14} color="#94A3B8" />
            <Text className="flex-1 pl-2 text-sm font-semibold text-slate-900">{newDate}</Text>
            <Feather name="chevron-down" size={14} color="#94A3B8" />
          </Pressable>

          <View className="mt-3 flex-row gap-2">
            <View className="flex-1">
              <Text className="text-xs text-slate-600">Start time</Text>
              <Pressable
                onPress={() => {
                  setPickerContext("create");
                  setPickerTarget("start");
                }}
                className="mt-1 flex-row items-center rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                <Feather name="clock" size={14} color="#94A3B8" />
                <Text className="flex-1 pl-2 text-sm font-semibold text-slate-900">{startTime}</Text>
                <Feather name="chevron-down" size={14} color="#94A3B8" />
              </Pressable>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-600">End time</Text>
              <Pressable
                onPress={() => {
                  setPickerContext("create");
                  setPickerTarget("end");
                }}
                className="mt-1 flex-row items-center rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                <Feather name="clock" size={14} color="#94A3B8" />
                <Text className="flex-1 pl-2 text-sm font-semibold text-slate-900">{endTime}</Text>
                <Feather name="chevron-down" size={14} color="#94A3B8" />
              </Pressable>
            </View>
          </View>
          <Text className="mb-2 mt-4 text-xs font-semibold text-slate-600">Categories on this mission</Text>
          {categories.map((c) => {
            const enabled = !!enabledCatKeys[c.key];
            const isRange = c.durationMinutesMin != null && c.durationMinutesMax != null;
            const shownDuration = catDurations[c.key] ?? (typeof c.durationMinutes === "number" ? c.durationMinutes : c.durationMinutesMin ?? 15);
            return (
              <View key={c.key} className="border-b border-slate-100 pb-2 pt-2">
                <Pressable
                  onPress={() =>
                    setEnabledCatKeys((p) => ({
                      ...p,
                      [c.key]: !p[c.key],
                    }))
                  }
                  className="flex-row items-center justify-between"
                >
                  <Text className="flex-1 pr-2 text-slate-800">
                    {c.label}
                    {typeof c.durationMinutes === "number" ? ` · ${c.durationMinutes} min` : ""}
                    {isRange ? ` · ${shownDuration} min` : ""}
                  </Text>
                  <Text className="font-bold text-mc-primary">{enabled ? "ON" : "off"}</Text>
                </Pressable>

                {enabled && isRange ? (
                  <View className="mt-2">
                    <Text className="mb-1 text-[11px] text-slate-500">Duration (minutes)</Text>
                    <TextInput
                      value={String(shownDuration)}
                      onChangeText={(t) => {
                        if (t.trim().length === 0) return;
                        const n = Number(t);
                        if (!Number.isFinite(n)) return;
                        const min = c.durationMinutesMin ?? n;
                        const max = c.durationMinutesMax ?? n;
                        const clamped = Math.min(max, Math.max(min, n));
                        setCatDurations((prev) => ({ ...prev, [c.key]: clamped }));
                      }}
                      keyboardType="number-pad"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                    />
                    <Text className="mt-1 text-[10px] text-slate-400">
                      {c.durationMinutesMin}–{c.durationMinutesMax} min
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          })}
          <Pressable
            onPress={() => void handleCreateMission()}
            disabled={saving}
            className="mt-4 items-center rounded-xl bg-mc-primary py-3 active:opacity-90"
          >
            <Text className="font-semibold text-white">{saving ? "Saving…" : "Create mission schedule"}</Text>
          </Pressable>
        </View>

        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">Select mission</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
            <View className="flex-row gap-2">
              {missions.map((m) => (
                <View
                  key={m._id}
                  className={`w-52 rounded-xl border px-3 py-2 ${selectedMissionId === m._id ? "border-mc-primary bg-blue-50" : "border-slate-200 bg-slate-50"}`}
                >
                  <Pressable onPress={() => setSelectedMissionId(m._id)} className="flex-1">
                    <Text className="text-sm font-medium text-slate-800">{new Date(m.date).toLocaleDateString()}</Text>
                    <Text className="mt-1 text-xs text-slate-500">
                      {(() => {
                        const morning = `${m.morningStart}–${m.morningEnd}`;
                        const aStart = hhmmToMinutes(m.afternoonStart);
                        const aEnd = hhmmToMinutes(m.afternoonEnd);
                        const afternoonValid = Number.isFinite(aStart) && Number.isFinite(aEnd) && aEnd > aStart;
                        return afternoonValid ? `${m.morningStart}–${m.morningEnd} · ${m.afternoonStart}–${m.afternoonEnd}` : morning;
                      })()}
                    </Text>
                  </Pressable>

                  <View className="mt-2 flex-row items-center justify-between">
                    <Pressable
                      onPress={() => openEditMission(m)}
                      className="rounded-lg bg-white/70 p-2"
                      hitSlop={8}
                    >
                      <Feather name="edit-3" size={16} color="#3B5BDB" />
                    </Pressable>
                    <Pressable
                      onPress={() => void handleDeleteMission(m._id)}
                      className="rounded-lg bg-white/70 p-2"
                      hitSlop={8}
                    >
                      <Feather name="trash-2" size={16} color="#EF4444" />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          {!missions.length ? (
            <Text className="mt-2 text-sm text-slate-500">No missions yet. Create one above.</Text>
          ) : null}
        </View>

        {selectedMission && missionDetail ? (
          <View className="rounded-2xl border border-slate-200 bg-white p-4">
            <Text className="text-lg font-semibold text-slate-900">Booked timeline</Text>
            {timeline.length === 0 ? (
              <Text className="mt-2 text-sm text-slate-500">No confirmed slots yet.</Text>
            ) : (
              timeline.map((row) => (
                <View key={row._id} className="mt-2 border-b border-slate-100 pb-2">
                  <Text className="font-medium text-slate-900">
                    {row.slotStart ? formatSlotLabel(row.slotStart) : "—"}
                  </Text>
                  <Text className="text-sm text-slate-600">
                    {row.resident?.fullname ?? "Patient"} · {row.assignedCategoryKey ?? row.consultationType} ·{" "}
                    {row.status}
                  </Text>
                  <Pressable onPress={() => openAssign(row, "reassign")} className="mt-1 self-start">
                    <Text className="text-sm font-semibold text-mc-primary">Reschedule</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        ) : null}

        {analytics.length > 0 ? (
          <View className="rounded-2xl border border-slate-200 bg-white p-4">
            <Text className="text-lg font-semibold text-slate-900">Analytics (this mission)</Text>
            {analytics.map((row, i) => (
              <Text key={i} className="mt-1 text-sm text-slate-700">
                {row._id.category} · {row._id.status}: {row.count}
              </Text>
            ))}
          </View>
        ) : null}

        <View className="rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-lg font-semibold text-slate-900">Pending queue (priority)</Text>
          <Text className="mb-2 text-xs text-slate-500">Sorted: priority tier, then first-come.</Text>
          {pending.length === 0 ? (
            <Text className="text-sm text-slate-500">Queue is empty.</Text>
          ) : (
            pending.map((pitem) => (
              <View key={pitem._id} className="mb-3 border-b border-slate-100 pb-3">
                <Text className="font-semibold text-slate-900">{pitem.resident?.fullname ?? "Resident"}</Text>
                <Text className="text-xs text-slate-500">
                  {tierLabel(pitem.ageTier)} · requested: {pitem.consultationType}
                  {pitem.isUrgent ? " · URGENT" : ""}
                </Text>
                <Text className="mt-1 text-sm text-slate-700">{pitem.description || "—"}</Text>
                <View className="mt-2 flex-row flex-wrap gap-2">
                  <Pressable
                    onPress={() => openAssign(pitem, "assign")}
                    className="rounded-lg bg-mc-primary px-3 py-2"
                  >
                    <Text className="text-sm font-semibold text-white">Assign slot</Text>
                  </Pressable>
                  <Pressable onPress={() => handleReject(pitem)} className="rounded-lg border border-red-200 px-3 py-2">
                    <Text className="text-sm font-semibold text-red-600">Decline</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>

        <Pressable
          onPress={() => void refreshLists()}
          className="items-center rounded-xl border border-slate-300 py-3"
        >
          <Text className="font-medium text-slate-700">Refresh data</Text>
        </Pressable>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {pickerTarget ? (
        <DateTimePicker
          value={
            pickerTarget === "date"
              ? (() => {
                  const key = pickerContext === "edit" ? editDate : newDate;
                  const [y, m, d] = key.split("-").map((x) => Number(x));
                  return new Date(y, (m ?? 1) - 1, d ?? 1);
                })()
              : (() => {
                  const t =
                    pickerTarget === "start"
                      ? pickerContext === "edit"
                        ? editStartTime
                        : startTime
                      : pickerContext === "edit"
                        ? editEndTime
                        : endTime;
                  const [hRaw, minRaw] = t.split(":");
                  const h = Number(hRaw);
                  const min = Number(minRaw);
                  const d = new Date();
                  d.setHours(Number.isFinite(h) ? h : 0, Number.isFinite(min) ? min : 0, 0, 0);
                  return d;
                })()
          }
          mode={pickerTarget === "date" ? "date" : "time"}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event: any, date?: Date) => {
            if (event.type === "dismissed") {
              setPickerTarget(null);
              setPickerContext(null);
              return;
            }
            if (!date) return;

            if (pickerTarget === "date") {
              const next = dateToYYYYMMDD(date);
              if (pickerContext === "edit") setEditDate(next);
              else setNewDate(next);
            } else if (pickerTarget === "start") {
              const next = formatHHMM(date);
              if (pickerContext === "edit") setEditStartTime(next);
              else setStartTime(next);
            } else if (pickerTarget === "end") {
              const next = formatHHMM(date);
              if (pickerContext === "edit") setEditEndTime(next);
              else setEndTime(next);
            }

            setPickerTarget(null);
            setPickerContext(null);
          }}
        />
      ) : null}

      <Modal
        visible={editOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setEditOpen(false);
          setPickerTarget(null);
          setPickerContext(null);
        }}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="max-h-[85%] rounded-t-3xl bg-white p-4">
            <Text className="text-lg font-bold text-slate-900">Edit schedule</Text>
            <Text className="text-sm text-slate-600">Update date, time range, and categories.</Text>

            <ScrollView className="mt-3">
              <Text className="text-xs font-semibold text-slate-600">Mission date</Text>
              <Pressable
                onPress={() => {
                  setPickerContext("edit");
                  setPickerTarget("date");
                }}
                className="mt-1 flex-row items-center rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                <Feather name="calendar" size={14} color="#94A3B8" />
                <Text className="flex-1 pl-2 text-sm font-semibold text-slate-900">{editDate}</Text>
                <Feather name="chevron-down" size={14} color="#94A3B8" />
              </Pressable>

              <View className="mt-3 flex-row gap-2">
                <View className="flex-1">
                  <Text className="text-xs text-slate-600">Start time</Text>
                  <Pressable
                    onPress={() => {
                      setPickerContext("edit");
                      setPickerTarget("start");
                    }}
                    className="mt-1 flex-row items-center rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <Feather name="clock" size={14} color="#94A3B8" />
                    <Text className="flex-1 pl-2 text-sm font-semibold text-slate-900">{editStartTime}</Text>
                    <Feather name="chevron-down" size={14} color="#94A3B8" />
                  </Pressable>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-slate-600">End time</Text>
                  <Pressable
                    onPress={() => {
                      setPickerContext("edit");
                      setPickerTarget("end");
                    }}
                    className="mt-1 flex-row items-center rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <Feather name="clock" size={14} color="#94A3B8" />
                    <Text className="flex-1 pl-2 text-sm font-semibold text-slate-900">{editEndTime}</Text>
                    <Feather name="chevron-down" size={14} color="#94A3B8" />
                  </Pressable>
                </View>
              </View>

              <Text className="mb-2 mt-5 text-xs font-semibold text-slate-600">Categories</Text>
              {categories.map((c) => {
                const enabled = !!editEnabledCatKeys[c.key];
                const isRange = c.durationMinutesMin != null && c.durationMinutesMax != null;
                const shownDuration =
                  editCatDurations[c.key] ??
                  (typeof c.durationMinutes === "number" ? c.durationMinutes : c.durationMinutesMin ?? 15);
                return (
                  <View key={c.key} className="border-b border-slate-100 pb-2 pt-2">
                    <Pressable
                      onPress={() =>
                        setEditEnabledCatKeys((p) => ({
                          ...p,
                          [c.key]: !p[c.key],
                        }))
                      }
                      className="flex-row items-center justify-between"
                    >
                      <Text className="flex-1 pr-2 text-slate-800">
                        {c.label}
                        {typeof c.durationMinutes === "number" ? ` · ${c.durationMinutes} min` : ""}
                        {isRange ? ` · ${shownDuration} min` : ""}
                      </Text>
                      <Text className="font-bold text-mc-primary">{enabled ? "ON" : "off"}</Text>
                    </Pressable>

                    {enabled && isRange ? (
                      <View className="mt-2">
                        <Text className="mb-1 text-[11px] text-slate-500">Duration (minutes)</Text>
                        <TextInput
                          value={String(shownDuration)}
                          onChangeText={(t) => {
                            if (t.trim().length === 0) return;
                            const n = Number(t);
                            if (!Number.isFinite(n)) return;
                            const min = c.durationMinutesMin ?? n;
                            const max = c.durationMinutesMax ?? n;
                            const clamped = Math.min(max, Math.max(min, n));
                            setEditCatDurations((prev) => ({ ...prev, [c.key]: clamped }));
                          }}
                          keyboardType="number-pad"
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                        />
                        <Text className="mt-1 text-[10px] text-slate-400">
                          {c.durationMinutesMin}–{c.durationMinutesMax} min
                        </Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </ScrollView>

            <View className="mt-4 flex-row gap-2">
              <Pressable
                onPress={() => {
                  setEditOpen(false);
                  setPickerTarget(null);
                  setPickerContext(null);
                }}
                className="flex-1 items-center rounded-xl border border-slate-300 py-3"
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => void handleSaveEdit()} disabled={saving} className="flex-1 items-center rounded-xl bg-mc-primary py-3">
                <Text className="font-semibold text-white">{saving ? "Saving…" : "Save changes"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={assignOpen} transparent animationType="fade">
        <View className="flex-1 justify-end bg-black/40">
          <View className="max-h-[85%] rounded-t-3xl bg-white p-4">
            <Text className="text-lg font-bold text-slate-900">
              {assignMode === "assign" ? "Assign to slot" : "Reschedule"}
            </Text>
            <Text className="text-sm text-slate-600">
              Mission: {selectedMission ? new Date(selectedMission.date).toLocaleDateString() : "—"}
            </Text>

            <Text className="mt-3 text-xs font-semibold text-slate-600">Category for slot</Text>
            <ScrollView className="max-h-32 mt-1">
              {categories.map((c) => (
                <Pressable
                  key={c.key}
                  onPress={() => setAssignCategory(c.key)}
                  className={`rounded-lg px-2 py-2 ${assignCategory === c.key ? "bg-blue-100" : ""}`}
                >
                  <Text>{c.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {(categories.find((x) => x.key === assignCategory)?.durationMinutesMin != null ||
              assignCategory === "general_checkup" ||
              assignCategory === "consultation") && (
              <View className="mt-2">
                <Text className="text-xs text-slate-600">Duration (minutes, within allowed range)</Text>
                <TextInput
                  value={assignDuration}
                  onChangeText={setAssignDuration}
                  keyboardType="number-pad"
                  className="mt-1 rounded-xl border border-slate-200 px-3 py-2"
                  placeholder="e.g. 20"
                />
              </View>
            )}

            <Pressable
              onPress={() => void loadSlotsForAssign()}
              className="mt-3 items-center rounded-xl bg-slate-800 py-2"
            >
              <Text className="font-semibold text-white">
                {assignLoadingSlots ? "Loading slots…" : "Load / refresh available slots"}
              </Text>
            </Pressable>

            <Text className="mt-3 text-xs font-semibold text-slate-600">Pick start time (validated)</Text>
            <ScrollView className="mt-1 max-h-48">
              {assignSlots.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setAssignSelectedSlot(s)}
                  className={`rounded-lg border px-2 py-2 ${assignSelectedSlot === s ? "border-mc-primary bg-blue-50" : "border-slate-100"}`}
                >
                  <Text>{formatSlotLabel(s)}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View className="mt-4 flex-row gap-2">
              <Pressable
                onPress={() => setAssignOpen(false)}
                className="flex-1 items-center rounded-xl border border-slate-300 py-3"
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => void submitAssign()}
                disabled={saving}
                className="flex-1 items-center rounded-xl bg-mc-primary py-3"
              >
                <Text className="font-semibold text-white">{saving ? "Saving…" : "Confirm"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
