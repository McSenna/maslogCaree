import type { CompletionForm, MedicalRecordInput } from "@/services/medicalRecords";
import type { FieldValue } from "../MedicalFieldInput";

export type FormValues = Record<string, FieldValue>;

export const emptyValues = (form: CompletionForm | null): FormValues => {
  const values: FormValues = {};
  if (!form) return values;
  for (const field of [...form.common, ...form.service, ...form.followUp]) {
    values[field.key] = field.type === "boolean" ? false : "";
  }
  return values;
};

export const isBlank = (value: FieldValue): boolean => {
  return value === null || value === undefined || value === "";
};

export const validateValues = (
  form: CompletionForm | null,
  values: FormValues
): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!form) return errors;

  const followUpOn = values.followUpRequired === true;

  for (const field of [...form.common, ...form.service, ...form.followUp]) {
    if (field.dependsOn && values[field.dependsOn] !== true) continue;
    if (field.key === "followUpDate" && !followUpOn) continue;

    const value = values[field.key];

    if (field.required && isBlank(value)) {
      errors[field.key] = `${field.label} is required.`;
      continue;
    }
    if (isBlank(value)) continue;

    if (field.type === "number") {
      const n = Number(value);
      if (!Number.isFinite(n)) {
        errors[field.key] = `${field.label} must be a number.`;
      } else if (typeof field.min === "number" && n < field.min) {
        errors[field.key] = `${field.label} must be at least ${field.min}.`;
      } else if (typeof field.max === "number" && n > field.max) {
        errors[field.key] = `${field.label} must be at most ${field.max}.`;
      }
    }

    if (field.type === "date" && Number.isNaN(new Date(String(value)).getTime())) {
      errors[field.key] = `${field.label} is not a valid date.`;
    }
  }

  return errors;
};

export const toMedicalRecordInput = (form: CompletionForm, values: FormValues): MedicalRecordInput => {
  const text = (key: string) => {
    const v = values[key];
    return typeof v === "string" ? v.trim() : "";
  };

  const serviceDetails: Record<string, string | number | boolean> = {};
  for (const field of form.service) {
    const value = values[field.key];
    if (isBlank(value)) continue;
    serviceDetails[field.key] = field.type === "number" ? Number(value) : (value as string | boolean);
  }

  const followUpRequired = values.followUpRequired === true;

  return {
    assessment: text("assessment"),
    findings: text("findings"),
    diagnosis: text("diagnosis"),
    recommendations: text("recommendations"),
    notes: text("notes"),
    serviceDetails,
    followUpRequired,
    followUpDate: followUpRequired && !isBlank(values.followUpDate) ? String(values.followUpDate) : null,
  };
};
