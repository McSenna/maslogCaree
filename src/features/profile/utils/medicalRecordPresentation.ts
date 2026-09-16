import { getServiceLabel } from "@/config/appointmentServices";
import type { MedicalRecord } from "@/services/medicalRecords";
import { formatDate } from "@/utils/dateFormatter";

export const recordServiceLabel = (record: MedicalRecord): string =>
  getServiceLabel(record.serviceType) || record.serviceType;

export const recordProviderName = (record: MedicalRecord): string | null => {
  if (!record.provider || typeof record.provider === "string") return null;

  const name = record.provider.fullname?.trim();
  if (!name) return null;

  const role = record.provider.role?.trim();
  return role ? `${name} · ${role}` : name;
};

export const recordDate = (record: MedicalRecord): string =>
  formatDate(record.appointmentDate ?? record.completedAt);

export const recordSummary = (record: MedicalRecord): string | null => {
  const summary = record.diagnosis?.trim() || record.assessment?.trim();
  return summary ? summary : null;
};

export const recordFollowUp = (record: MedicalRecord): string | null => {
  if (!record.followUpRequired) return null;

  return record.followUpDate
    ? `Follow-up on ${formatDate(record.followUpDate)}`
    : "Follow-up required";
};
