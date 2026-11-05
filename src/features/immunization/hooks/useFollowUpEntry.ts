import { useState } from "react";
import { isCalendarDay, todayKey } from "../immunizationLogic";
import { immunizationApi } from "../services/immunizationApi";
import type { PatientDose } from "../types";
import type useClinicalSave from "./useClinicalSave";

/** Lives with the modal, not the form: its Save button sits in the pinned footer. */
const useFollowUpEntry = (
  patient: PatientDose,
  saving: ReturnType<typeof useClinicalSave>,
  onSaved: () => Promise<void>,
) => {
  const [followUpOn, setFollowUpOn] = useState("");
  const [reason, setReason] = useState("");
  const [deferred, setDeferred] = useState(true);
  const [checked, setChecked] = useState(false);
  const errors = checked
    ? {
        followUpOn: !isCalendarDay(followUpOn) || followUpOn < todayKey() ? "Select a follow-up date today or later." : undefined,
        reason: reason.trim() ? undefined : "Enter the reason for this follow-up.",
      }
    : { followUpOn: undefined, reason: undefined };
  const save = () => {
    setChecked(true);
    if (!isCalendarDay(followUpOn) || followUpOn < todayKey() || !reason.trim()) return;
    void saving.save(
      () => immunizationApi.followUp({ ...patient, followUpOn, reason: reason.trim(), deferred }),
      onSaved,
    );
  };
  return { followUpOn, setFollowUpOn, reason, setReason, deferred, setDeferred, errors, save, values: { followUpOn, reason, deferred } };
};
export default useFollowUpEntry;
