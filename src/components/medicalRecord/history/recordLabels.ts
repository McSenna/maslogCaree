import type { MedicalRecord } from "@/services/medicalRecords";
import { PROVIDER_ROLE_LABELS, SERVICE_TYPES, getServiceLabel } from "@/config/appointmentServices";

export const serviceLabelOf = (record: MedicalRecord): string => {
  return getServiceLabel(record.serviceType) || record.serviceType;
};

export const providerNameOf = (record: MedicalRecord): string => {
  return typeof record.provider === "object" && record.provider
    ? (record.provider.fullname ?? "")
    : "";
};

export const providerRoleLabelOf = (record: MedicalRecord): string => {
  const stored =
    record.providerRole ||
    (typeof record.provider === "object" ? record.provider?.role : "") ||
    SERVICE_TYPES.find((s) => s.id === record.serviceType)?.queueRole ||
    "";

  const key = String(stored).trim().toLowerCase();
  return PROVIDER_ROLE_LABELS[key] ?? (key ? key.charAt(0).toUpperCase() + key.slice(1) : "");
};

export const summarizeRecord = (record: MedicalRecord, limit = 150): string => {
  const source = [record.recommendations, record.assessment, record.findings]
    .map((value) => (value ?? "").trim())
    .find(Boolean);

  if (!source) return "";

  const flat = source.replace(/\s+/g, " ");
  if (flat.length <= limit) return flat;

  const clipped = flat.slice(0, limit);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > limit * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
};

export const VITAL_GROUPS = new Set(["Vital signs", "Maternal vitals", "Blood pressure"]);

export const FOLLOW_UP_DETAIL_KEYS = new Set([
  "followUpInstructions",
  "nextCheckupDate",
  "nextDoseDate",
  "recheckDate",
]);
