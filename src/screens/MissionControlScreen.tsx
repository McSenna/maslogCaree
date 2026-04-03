import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  Platform,
  View,
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
} from "@/services/appointments";

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
  const [loading, setLoading] = useState(true);
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

  const selectedMission = useMemo(
    () => missions.find((m) => m._id === selectedMissionId) ?? null,
    [missions, selectedMissionId]
  );

  const refreshLists = useCallback(async () => {
    setLoading(true);
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
      const msg = e instanceof Error ? e.message : "Failed to load";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMissionDetail = useCallback(async (id: string) => {
    try {
      const detail = await fetchMissionDetail(id);
      setMissionDetail(detail);
      const an = await fetchCategoryAnalytics(id);
      setAnalytics(an);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load mission";
      Alert.alert("Error", msg);
    }
  }, []);

  useEffect(() => {
    void refreshLists();
  }, [refreshLists]);

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
      Alert.alert("Select mission", "Choose a mission schedule first, then a category.");
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
      const msg = e instanceof Error ? e.message : "Could not load slots";
      Alert.alert("Slots", msg);
    } finally {
      setAssignLoadingSlots(false);
    }
  };

  const submitAssign = async () => {
    if (!assignTarget || !selectedMissionId || !assignSelectedSlot || !assignCategory) {
      Alert.alert("Incomplete", "Choose category and time slot.");
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
      await loadMissionDetail(selectedMissionId);
      Alert.alert("Saved", assignMode === "assign" ? "Appointment confirmed." : "Appointment rescheduled.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Save failed";
      Alert.alert("Error", msg);
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
      Alert.alert("Categories", "Enable at least one category.");
      return;
    }

    // UI guard for the critical rule (backend also enforces).
    const hasDuplicateForDay = missions.some((m) => {
      const mDay = m.date ? new Date(m.date).toISOString().slice(0, 10) : "";
      return mDay === newDate;
    });
    if (hasDuplicateForDay) {
      Alert.alert("Error", "A mission schedule already exists for this date.");
      return;
    }

    const sMin = hhmmToMinutes(startTime);
    const eMin = hhmmToMinutes(endTime);
    if (Number.isFinite(sMin) && Number.isFinite(eMin) && eMin <= sMin) {
      Alert.alert("Invalid time range", "End time must be after start time.");
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
      // Auto-select newly created schedule for a faster edit/assign workflow.
      if (created?._id) {
        setSelectedMissionId(created._id);
        await loadMissionDetail(created._id);
      }
      Alert.alert("Created", "Mission schedule saved. You can assign patients from the queue.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Create failed";
      Alert.alert("Error", msg);
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
      Alert.alert("Categories", "Enable at least one category.");
      return;
    }

    const sMin = hhmmToMinutes(editStartTime);
    const eMin = hhmmToMinutes(editEndTime);
    if (Number.isFinite(sMin) && Number.isFinite(eMin) && eMin <= sMin) {
      Alert.alert("Invalid time range", "End time must be after start time.");
      return;
    }

    // UI guard for the critical rule (backend also enforces).
    const hasDuplicateForDay = missions.some((m) => {
      const mDay = m.date ? new Date(m.date).toISOString().slice(0, 10) : "";
      return mDay === editDate && m._id !== editMissionId;
    });
    if (hasDuplicateForDay) {
      Alert.alert("Error", "A mission schedule already exists for this date.");
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
      setSelectedMissionId(editMissionId);
      await loadMissionDetail(editMissionId);
      Alert.alert("Saved", "Mission schedule updated.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Update failed";
      Alert.alert("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMission = async (missionId: string) => {
    Alert.alert("Delete schedule", "This will move any booked appointments back to Pending.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setSaving(true);
          try {
            await deleteMissionSchedule(missionId);
            await refreshLists();

            if (selectedMissionId === missionId) {
              setSelectedMissionId(null);
              setMissionDetail(null);
              setAnalytics([]);
            }

            setEditOpen(false);
            Alert.alert("Deleted", "Mission schedule removed.");
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Delete failed";
            Alert.alert("Error", msg);
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  const handleReject = (appt: AppointmentRecord) => {
    Alert.alert("Decline appointment", "Reject this queued request?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: async () => {
          try {
            await rejectAppointment(appt._id, "Declined by medical staff");
            await refreshLists();
            if (selectedMissionId) await loadMissionDetail(selectedMissionId);
          } catch (e: unknown) {
            Alert.alert("Error", e instanceof Error ? e.message : "Failed");
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

  if (loading && !missions.length) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#2D5BFF" />
        <Text className="mt-3 text-slate-600">Loading mission data…</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6 pb-24">
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
      </View>

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
    </ScrollView>
  );
}
