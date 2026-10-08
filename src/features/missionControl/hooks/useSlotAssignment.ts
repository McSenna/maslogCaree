import { useCallback, useState } from "react";
import {
  assignAppointment,
  fetchAvailableSlots,
  reassignAppointment,
  type AppointmentRecord,
  type ConsultationCategory,
} from "@/services/appointments";
import { toast } from "@/components/feedback/toast/toastStore";
import { toastError } from "@/utils/errorToast/toastError";

export type AssignMode = "assign" | "reassign";

type SlotAssignmentInput = {
  selectedMissionId: string | null;
  categories: ConsultationCategory[];
  setSaving: (saving: boolean) => void;
  onAssigned: (missionId: string) => Promise<void>;
};

export const useSlotAssignment = ({
  selectedMissionId,
  categories,
  setSaving,
  onAssigned,
}: SlotAssignmentInput) => {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<AppointmentRecord | null>(null);
  const [mode, setMode] = useState<AssignMode>("assign");
  const [categoryKey, setCategoryKey] = useState("");
  const [duration, setDuration] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const openFor = useCallback((appointment: AppointmentRecord, nextMode: AssignMode) => {
    setTarget(appointment);
    setMode(nextMode);
    setCategoryKey(appointment.consultationType || "");
    setDuration("");
    setSlots([]);
    setSelectedSlot(null);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const loadSlots = useCallback(async () => {
    if (!selectedMissionId || !categoryKey) {
      toast.error("Choose a mission schedule", "Select a mission schedule first, then a category.");
      return;
    }

    const category = categories.find((entry) => entry.key === categoryKey);
    const durationParam =
      category?.durationMinutesMin != null && duration ? Number(duration) : undefined;
    const excludeAppointmentId = mode === "reassign" ? target?._id : undefined;

    setLoadingSlots(true);
    try {
      // The slot list already carries the suggested next slot, so one request is enough.
      const pack = await fetchAvailableSlots(
        selectedMissionId,
        categoryKey,
        durationParam,
        excludeAppointmentId
      );

      setSlots(pack.availableSlotStarts);
      if (pack.suggestedNextSlotStart) setSelectedSlot(pack.suggestedNextSlotStart);
      if (pack.durationMinutes && !duration) setDuration(String(pack.durationMinutes));
    } catch (error: unknown) {
      toastError("Unable to load time slots", error, { fallback: "Could not load available time slots." });
    } finally {
      setLoadingSlots(false);
    }
  }, [categories, categoryKey, duration, mode, selectedMissionId, target]);

  const submit = useCallback(async () => {
    if (!target || !selectedMissionId || !selectedSlot || !categoryKey) {
      toast.error("Choose a category and time slot");
      return;
    }

    setSaving(true);
    try {
      const body = {
        missionScheduleId: selectedMissionId,
        categoryKey,
        slotStart: selectedSlot,
        durationMinutes: duration ? Number(duration) : undefined,
      };

      if (mode === "assign") await assignAppointment(target._id, body);
      else await reassignAppointment(target._id, body);

      setOpen(false);
      toast.success(mode === "assign" ? "Appointment confirmed" : "Appointment rescheduled");
      void onAssigned(selectedMissionId);
    } catch (error: unknown) {
      toastError("Unable to schedule appointment", error, { fallback: "The appointment could not be scheduled." });
    } finally {
      setSaving(false);
    }
  }, [
    categoryKey,
    duration,
    mode,
    onAssigned,
    selectedMissionId,
    selectedSlot,
    setSaving,
    target,
  ]);

  return {
    open,
    target,
    mode,
    categoryKey,
    setCategoryKey,
    duration,
    setDuration,
    slots,
    selectedSlot,
    setSelectedSlot,
    loadingSlots,
    openFor,
    close,
    loadSlots,
    submit,
  };
};
