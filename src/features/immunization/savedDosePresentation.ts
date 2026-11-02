import type { Checklist, DoseRecord, DoseView } from "./types";

export const savedDoseStatus = (record: DoseRecord): string => {
  if (record.workflowStatus === "draft") return "Draft. Not administered";
  if (record.state === "administered") return "Administered";
  if (record.state === "deferred") return "Deferred";
  return record.history.at(-1)?.action === "follow_up"
    ? "Requires review"
    : "Voided";
};

// Unrecognized legacy keys stay inspectable without gaining a clinical edit path.
export const historyDose = (
  checklist: Checklist,
  record: DoseRecord,
): DoseView => {
  const dose = checklist.doses.find((item) => item.key === record.doseKey);
  return dose
    ? { ...dose, record }
    : {
        key: record.doseKey,
        vaccineKey: record.doseKey,
        label: "Saved dose",
        slot: "",
        targetOn: "",
        scheduledOn: "",
        status: "Requires review",
        reviewRequired: true,
        record,
      };
};
