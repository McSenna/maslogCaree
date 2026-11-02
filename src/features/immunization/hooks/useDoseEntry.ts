import { toast } from "@/components/feedback";
import { useState } from "react";
import { isAdministered, validateAdministration } from "../immunizationLogic";
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
    historical: record?.historical ?? false,
  });
  const [reason, setReason] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const saving = useClinicalSave();
  const patient = {
    motherMasterResidentId: checklist.mother.masterResidentId,
    babyId: checklist.baby._id,
    doseKey: dose.key,
  };
  const review = () => {
    const issue =
      action === "void" && completed
        ? ""
        : validateAdministration(
            administration.administeredOn,
            checklist.baby.dateOfBirth,
          );
    if (issue) {
      saving.setError(issue);
      return;
    }
    if (
      action !== "void" &&
      administration.administeredAt &&
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(administration.administeredAt)
    ) {
      saving.setError("Use a valid time in HH:mm format, or leave time blank.");
      return;
    }
    if (
      administration.historical &&
      !administration.administeredBy?.trim() &&
      action !== "void"
    ) {
      saving.setError(
        "Enter the clinician who administered this historical dose.",
      );
      return;
    }
    if (completed && !reason.trim()) {
      saving.setError(
        "Enter the reason for correcting or voiding this record.",
      );
      return;
    }
    saving.setError("");
    setReviewing(true);
  };
  const finish = async () => {
    await onSaved();
    onClose();
  };
  const saveDraft = () => void saving.save(
    () => immunizationApi.saveDraft({ ...patient, ...administration, expectedRevision: record?.revision ?? null }),
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
              expectedRevision: record.revision,
              ...(action === "correct" ? { administration } : {}),
            })
          : immunizationApi.administer({ ...patient, ...administration, expectedRevision: record?.revision ?? null }),
      async () => { toast.success(completed ? "Immunization correction saved" : "Immunization record completed"); await finish(); },
    );
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
    saving,
    patient,
    review,
    finish,
    save,
    saveDraft,
  };
};
export default useDoseEntry;
