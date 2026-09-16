import type { AppointmentRecord } from "@/services/appointments";
import type { CompletionForm, MedicalField, MedicalRecord } from "@/services/medicalRecords";
import { describeFieldValue, hasValue } from "../complete/describeValue";
import { FOLLOW_UP_DETAIL_KEYS, VITAL_GROUPS } from "./recordLabels";

export type DetailEntry = {
  key: string;
  label: string;
  value: string;
  raw?: string;
  unit?: string;
};

export type DetailGroup = {
  title: string;
  entries: DetailEntry[];
  isVitals: boolean;
};

const UNGROUPED = "Details";

const entryFor = (field: MedicalField | undefined, key: string, value: unknown): DetailEntry => {
  return {
    key,
    label: field?.label ?? key,
    value: describeFieldValue(field, value),
    raw: field?.unit ? String(value) : undefined,
    unit: field?.unit,
  };
};

export const buildDetailGroups = (
  record: MedicalRecord,
  form: CompletionForm | null
): DetailGroup[] => {
  const details = record.serviceDetails ?? {};
  const fields = form?.service ?? [];
  const byKey = new Map(fields.map((field) => [field.key, field]));

  const order: string[] = [];
  const grouped = new Map<string, DetailEntry[]>();

  const push = (groupTitle: string, entry: DetailEntry) => {
    if (!grouped.has(groupTitle)) {
      grouped.set(groupTitle, []);
      order.push(groupTitle);
    }
    grouped.get(groupTitle)!.push(entry);
  };

  for (const field of fields) {
    if (FOLLOW_UP_DETAIL_KEYS.has(field.key)) continue;
    if (!hasValue(details[field.key])) continue;
    push(field.group ?? UNGROUPED, entryFor(field, field.key, details[field.key]));
  }

  for (const key of Object.keys(details)) {
    if (byKey.has(key) || FOLLOW_UP_DETAIL_KEYS.has(key) || !hasValue(details[key])) continue;
    push(UNGROUPED, entryFor(undefined, key, details[key]));
  }

  return order.map((title) => ({
    title,
    entries: collapseBloodPressure(grouped.get(title) ?? []),
    isVitals: VITAL_GROUPS.has(title),
  }));
};

const collapseBloodPressure = (entries: DetailEntry[]): DetailEntry[] => {
  const systolic = entries.find((e) => e.key === "systolic");
  const diastolic = entries.find((e) => e.key === "diastolic");
  if (!systolic || !diastolic) return entries;

  const combined: DetailEntry = {
    key: "bloodPressure",
    label: "Blood Pressure",
    value: `${systolic.raw ?? systolic.value}/${diastolic.raw ?? diastolic.value} mmHg`,
    raw: `${systolic.raw ?? systolic.value}/${diastolic.raw ?? diastolic.value}`,
    unit: "mmHg",
  };

  const rest = entries.filter((e) => e.key !== "systolic" && e.key !== "diastolic");
  return [combined, ...rest];
};

export const buildAssessmentEntries = (record: MedicalRecord): DetailEntry[] => {
  return [
    { key: "diagnosis", label: "Diagnosis", value: record.diagnosis ?? "" },
    { key: "assessment", label: "Assessment", value: record.assessment ?? "" },
    { key: "findings", label: "Findings", value: record.findings ?? "" },
  ].filter((entry) => hasValue(entry.value));
};

export type FollowUp = {
  date: string | null;
  dateLabel: string;
  instructions: string;
  required: boolean;
};

export const buildFollowUp = (record: MedicalRecord, form: CompletionForm | null): FollowUp | null => {
  const details = record.serviceDetails ?? {};
  const fields = form?.service ?? [];

  const dateField = fields.find(
    (field) => FOLLOW_UP_DETAIL_KEYS.has(field.key) && field.type === "date" && hasValue(details[field.key])
  );

  const serviceDate = dateField ? String(details[dateField.key]) : null;
  const instructions = String(details.followUpInstructions ?? "").trim();

  const date = record.followUpDate ?? serviceDate;

  if (!record.followUpRequired && !date && !instructions) return null;

  return {
    date,
    dateLabel: dateField?.label ?? "Recommended return date",
    instructions,
    required: Boolean(record.followUpRequired),
  };
};

export type TimelineStep = {
  key: string;
  label: string;
  at: string | null;
};

export const buildTimeline = (record: MedicalRecord): TimelineStep[] => {
  const appointment: Partial<AppointmentRecord> | null =
    typeof record.appointment === "object" && record.appointment ? record.appointment : null;

  return [
    { key: "created", label: "Appointment created", at: appointment?.createdAt ?? null },
    { key: "approved", label: "Appointment approved", at: appointment?.approvedAt ?? null },
    {
      key: "served",
      label: "Healthcare service performed",
      at: record.appointmentDate ?? appointment?.slotStart ?? null,
    },
    { key: "recorded", label: "Medical record created", at: record.createdAt ?? record.completedAt },
    { key: "completed", label: "Completed", at: record.completedAt },
  ];
};
