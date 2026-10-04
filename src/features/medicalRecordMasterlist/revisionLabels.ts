// Import-free (types only) so `node --test` can load it.
import type { CompletionForm } from "@/services/medicalRecordTypes";

const VISIT_LABELS: Record<string, string> = {
  completedAt: "Visit date",
  providerName: "Provider name",
  providerRole: "Provider role",
  visitReason: "Reason for visit",
};

/** A readable name for a changed field ("serviceDetails.systolic" becomes "Systolic"). */
export const changedFieldLabel = (field: string, form: CompletionForm | null): string => {
  if (VISIT_LABELS[field]) return VISIT_LABELS[field];
  const key = field.startsWith("serviceDetails.") ? field.slice("serviceDetails.".length) : field;
  const all = form ? [...form.common, ...form.service, ...form.followUp] : [];
  return all.find((candidate) => candidate.key === key)?.label ?? key;
};

/** How an earlier value reads in the history ("Not recorded" for blanks). */
export const previousValueText = (field: string, value: string | number | boolean | null): string => {
  if (value === null || value === "") return "Not recorded";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (field === "completedAt" || field === "followUpDate") return String(value).slice(0, 10);
  return String(value);
};
