import { useCallback, useMemo, useState } from "react";
import { Text, View } from "react-native";
import type { CompletionForm, MedicalField, MedicalRecordInput } from "@/services/medicalRecords";
import MedicalFieldInput, { type FieldValue } from "./MedicalFieldInput";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";

export type FormValues = Record<string, FieldValue>;

/** A blank form: booleans start false, everything else empty. */
export function emptyValues(form: CompletionForm | null): FormValues {
  const values: FormValues = {};
  if (!form) return values;
  for (const field of [...form.common, ...form.service, ...form.followUp]) {
    values[field.key] = field.type === "boolean" ? false : "";
  }
  return values;
}

function isBlank(value: FieldValue): boolean {
  return value === null || value === undefined || value === "";
}

/**
 * Checks a filled form the way the server will.
 *
 * A mirror of `utils/medicalRecordValidation.js`, and only a courtesy: the
 * server runs the real check against the same catalogue and refuses anything
 * this misses. Its job is to put the message next to the box rather than in a
 * banner after a round trip.
 */
export function validateValues(form: CompletionForm | null, values: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form) return errors;

  const followUpOn = values.followUpRequired === true;

  for (const field of [...form.common, ...form.service, ...form.followUp]) {
    // A field gated on a flag that is off is not on screen, so it cannot be
    // required and must not be validated.
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
}

/** Turns form state into the request body the completion endpoint expects. */
export function toMedicalRecordInput(form: CompletionForm, values: FormValues): MedicalRecordInput {
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
}

function SectionHeading({ title, caption }: { title: string; caption?: string }) {
  const palette = useQueuePalette();
  return (
    <View className="w-full">
      <Text className="text-[12px] font-bold uppercase" style={{ color: palette.subtle, letterSpacing: 0.5 }}>
        {title}
      </Text>
      {caption ? (
        <Text className="mt-0.5 text-[12px]" style={{ color: palette.subtle }}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * The completion form for one service.
 *
 * Three sections in a fixed order — what was found, what this service records,
 * and whether the patient is coming back. Presentation only: it holds no
 * submission logic, so the modal and the bottom sheet share one form and
 * differ only in the container around it.
 */
export default function MedicalRecordForm({
  form,
  values,
  errors,
  onChange,
  disabled,
}: {
  form: CompletionForm;
  values: FormValues;
  errors: Record<string, string>;
  onChange: (key: string, value: FieldValue) => void;
  disabled?: boolean;
}) {
  const followUpOn = values.followUpRequired === true;

  const visibleFollowUp = useMemo(
    () => form.followUp.filter((field) => !(field.key === "followUpDate" && !followUpOn)),
    [form.followUp, followUpOn]
  );

  const render = useCallback(
    (field: MedicalField) => (
      <MedicalFieldInput
        key={field.key}
        field={field}
        value={values[field.key]}
        error={errors[field.key]}
        onChange={(next) => onChange(field.key, next)}
        disabled={disabled}
      />
    ),
    [values, errors, onChange, disabled]
  );

  return (
    <View className="w-full gap-4">
      <View className="w-full gap-3.5">
        <SectionHeading title="Assessment" />
        {form.common.map(render)}
      </View>

      {form.service.length ? (
        <View className="w-full gap-3.5">
          <SectionHeading title={form.label} caption={`Recorded for ${form.label} visits.`} />
          {form.service.map(render)}
        </View>
      ) : null}

      <View className="w-full gap-3.5">
        <SectionHeading title="Follow-up" />
        {visibleFollowUp.map(render)}
      </View>
    </View>
  );
}

/** Form state plus the handlers the modal needs, so the modal stays layout. */
export function useMedicalRecordForm(form: CompletionForm | null) {
  const [values, setValues] = useState<FormValues>(() => emptyValues(form));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = useCallback((next: CompletionForm | null) => {
    setValues(emptyValues(next));
    setErrors({});
  }, []);

  const onChange = useCallback((key: string, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // The message clears as soon as the box is touched: leaving it until the
    // next submit makes a corrected field keep saying it is wrong.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  }, []);

  const validate = useCallback(() => {
    const next = validateValues(form, values);
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form, values]);

  return { values, errors, setErrors, onChange, reset, validate };
}
