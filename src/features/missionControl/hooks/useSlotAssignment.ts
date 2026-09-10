import { useCallback, useState } from "react";
import {
  assignAppointment,
  fetchAvailableSlots,
  reassignAppointment,
  suggestNextSlot,
  type AppointmentRecord,
  type ConsultationCategory,
} from "@/services/appointments";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { showAlert } from "@/utils/notify";

/** Assigning a pending request, or moving one that already has a slot. */
export type AssignMode = "assign" | "reassign";

type SlotAssignmentInput = {
  selectedMissionId: string | null;
  categories: ConsultationCategory[];
  /** Shared with the mission writes so one Saving state covers the screen. */
  setSaving: (saving: boolean) => void;
  /** Revalidates the lists and dashboard after a confirmed assignment. */
  onAssigned: (missionId: string) => Promise<void>;
};

/**
 * The assign / reschedule sheet.
 *
 * The available times are never computed here. The server owns the mission's
 * capacity and its overlap rules, so the sheet asks it both for the full slot
 * list and for the one it recommends, and offers exactly what came back.
 */
export function useSlotAssignment({
  selectedMissionId,
  categories,
  setSaving,
  onAssigned,
}: SlotAssignmentInput) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<AppointmentRecord | null>(null);
  const [mode, setMode] = useState<AssignMode>("assign");
  const [categoryKey, setCategoryKey] = useState("");
  const [duration, setDuration] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  /** Opens the sheet on an appointment. Writes nothing until Confirm. */
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
      showAlert("Select mission", "Choose a mission schedule first, then a category.");
      return;
    }

    const category = categories.find((entry) => entry.key === categoryKey);
    // A duration is only sent for services whose length the mission chooses;
    // for a fixed-length service the server's own value must win.
    const durationParam =
      category?.durationMinutesMin != null && duration ? Number(duration) : undefined;
    // On a reschedule the appointment's current slot is excluded from the
    // occupied set, so its own time is still offered back.
    const excludeAppointmentId = mode === "reassign" ? target?._id : undefined;

    setLoadingSlots(true);
    try {
      const suggested = await suggestNextSlot(
        selectedMissionId,
        categoryKey,
        durationParam,
        excludeAppointmentId
      );
      const pack = await fetchAvailableSlots(
        selectedMissionId,
        categoryKey,
        durationParam,
        excludeAppointmentId
      );

      setSlots(pack.availableSlotStarts);
      if (suggested) setSelectedSlot(suggested);
      else if (pack.suggestedNextSlotStart) setSelectedSlot(pack.suggestedNextSlotStart);
      if (pack.durationMinutes && !duration) setDuration(String(pack.durationMinutes));
    } catch (error: unknown) {
      showAlert("Slots", getApiErrorMessage(error, "Could not load available time slots."));
    } finally {
      setLoadingSlots(false);
    }
  }, [categories, categoryKey, duration, mode, selectedMissionId, target]);

  const submit = useCallback(async () => {
    if (!target || !selectedMissionId || !selectedSlot || !categoryKey) {
      showAlert("Incomplete", "Choose category and time slot.");
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
      await onAssigned(selectedMissionId);
      showAlert(
        "Saved",
        mode === "assign" ? "Appointment confirmed." : "Appointment rescheduled."
      );
    } catch (error: unknown) {
      showAlert(
        "Could Not Save",
        getApiErrorMessage(error, "The appointment could not be scheduled.")
      );
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
}
