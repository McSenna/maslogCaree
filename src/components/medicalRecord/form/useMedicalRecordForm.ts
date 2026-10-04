import { useCallback, useState } from "react";

import type { CompletionForm } from "@/services/medicalRecords";
import type { FieldValue } from "../MedicalFieldInput";
import { emptyValues, validateValues, type FormValues } from "./formValues";

// `initial` prefills the form when editing a saved record.
export const useMedicalRecordForm = (form: CompletionForm | null, initial?: FormValues) => {
  const [values, setValues] = useState<FormValues>(() => initial ?? emptyValues(form));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = useCallback((next: CompletionForm | null, nextValues?: FormValues) => {
    setValues(nextValues ?? emptyValues(next));
    setErrors({});
  }, []);

  const onChange = useCallback((key: string, value: FieldValue) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  }, []);

  const validate = useCallback(() => {
    const next = validateValues(form, values);
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form, values]);

  return { values, errors, setErrors, onChange, reset, validate };
};
