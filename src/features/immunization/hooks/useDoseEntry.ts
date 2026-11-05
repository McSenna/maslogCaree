import { toast } from "@/components/feedback";
import { useState } from "react";
import { doseEntryErrors, doseRequestOf, isAdministered, type DoseEntryField } from "../immunizationLogic";
import { immunizationApi } from "../services/immunizationApi";
import type { Administration, Checklist, DoseView } from "../types";
import useClinicalSave from "./useClinicalSave";

const useDoseEntry = (
  checklist: Checklist,
  dose: DoseView,
  onSaved: () => Promise<void>,
  onClose: () => void,
) => {
  const completed = isAdministered(dose.record);
  const record = dose.record;
  const [mode, setMode] = useState<"administration" | "follow-up">(
    "administration",
  );
  const [action, setAction] = useState<"correct" | "void">("correct");
  const [administration, setAdministration] = useState<Administration>({
    administeredOn: record?.administeredOn?.slice(0, 10) ?? "",
    administeredAt: record?.administeredAt ?? "",
    administeredBy: record?.administeredBy ?? "",
    facility: record?.facility ?? "",
    lotNumber: record?.lotNumber ?? "",
    route: record?.route ?? "",
    site: record?.site ?? "",
    remarks: record?.remarks ?? "",
    immediateReaction: record?.immediateReaction ?? "",
    aefi: record?.aefi ?? "",
    historical: record?.historical ?? false,
  });
  const [reason, setReason] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [checked, setChecked] = useState(false);
  const saving = useClinicalSave();
  const patient = {
    motherMasterResidentId: checklist.mother.masterResidentId,
    babyId: checklist.baby._id,
    doseKey: dose.key,
  };
  const currentErrors = () =>
    doseEntryErrors({
      ...administration,
      birth: checklist.baby.dateOfBirth,
      amending: completed,
      voiding: completed && action === "void",
      reason,
    });
  const finish = async () => {
    await onSaved();
    onClose();
  };
  const saveDraft = () => void saving.save(
    () => immunizationApi.saveDraft({ ...patient, ...doseRequestOf(administration), expectedRevision: record?.revision ?? null }),
    async () => { toast.success("Immunization draft saved"); await finish(); },
  );
  const save = () =>
    void saving.save(
      () =>
        completed && record
          ? immunizationApi.correct({
              ...patient,
              action,
              reason: reason.trim(),
              expectedRevision: record.revision ?? 0,
              ...(action === "correct" ? { administration: doseRequestOf(administration) } : {}),
            })
          : immunizationApi.administer({ ...patient, ...doseRequestOf(administration), expectedRevision: record?.revision ?? null }),
      async () => { toast.success(completed ? "Immunization correction saved" : "Immunization record completed"); await finish(); },
    );
  /**
   * Returns the first field that needs fixing, so the modal can scroll to it.
   * A new dose saves at once. A correction or void is reviewed first, because it
   * changes a record already on file.
   */
  const submit = (): DoseEntryField | null => {
    setChecked(true);
    const errors = currentErrors();
    const first = (["reason", "administeredOn", "administeredAt", "administeredBy"] as const).find((field) => errors[field]);
    if (first) return first;
    saving.setError("");
    if (completed) setReviewing(true);
    else save();
    return null;
  };
  return {
    completed,
    mode,
    setMode,
    action,
    setAction,
    administration,
    setAdministration,
    reason,
    setReason,
    reviewing,
    setReviewing,
    errors: checked ? currentErrors() : {},
    saving,
    patient,
    submit,
    finish,
    save,
    saveDraft,
  };
};
export default useDoseEntry;
