import { useCallback, useEffect, useState } from "react";

import type { AppointmentRecord } from "@/services/appointments";
import { completeAppointment, type CompletionForm } from "@/services/medicalRecords";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

import { toMedicalRecordInput, type useMedicalRecordForm } from "../../MedicalRecordForm";
import type { useDispensedItems } from "../../dispensing/useDispensedItems";
import type { CompletionResult } from "../completionTypes";

export type CompletionStep = "form" | "review" | "success";

type Options = {
  visible: boolean;
  appointment: AppointmentRecord | null;
  form: CompletionForm | null;
  medicalForm: ReturnType<typeof useMedicalRecordForm>;
  dispensed: ReturnType<typeof useDispensedItems>;
  vaccineReset: () => void;
  onCompleted: (result: CompletionResult) => void;
};

export const useCompletionFlow = ({
  visible,
  appointment,
  form,
  medicalForm,
  dispensed,
  vaccineReset,
  onCompleted,
}: Options) => {
  const { values, setErrors, reset, validate } = medicalForm;

  const [step, setStep] = useState<CompletionStep>("form");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<CompletionResult | null>(null);

  useEffect(() => {
    if (!visible) return;
    reset(form);
    dispensed.reset();
    vaccineReset();
    setStep("form");
    setSaving(false);
    setSubmitError(null);
    setResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, form, reset]);

  const handleReview = useCallback(() => {
    setSubmitError(null);
    if (!validate()) {
      setSubmitError("Some required details are missing. Check the highlighted fields.");
      return;
    }
    setStep("review");
  }, [validate]);

  const handleConfirm = useCallback(async () => {
    if (!appointment || !form || saving) return;

    setSaving(true);
    setSubmitError(null);
    try {
      const saved = await completeAppointment(
        appointment._id,
        toMedicalRecordInput(form, values),
        dispensed.payload
      );
      setResult(saved);
      setStep("success");
      onCompleted(saved);
    } catch (e: unknown) {
      setStep("form");
      const fieldErrors = (e as { errors?: string[] })?.errors;
      setSubmitError(
        Array.isArray(fieldErrors) && fieldErrors.length
          ? fieldErrors.join(" ")
          : getApiErrorMessage(e, "The appointment could not be completed.")
      );
      setErrors((prev) => ({ ...prev }));
    } finally {
      setSaving(false);
    }
  }, [appointment, form, values, saving, onCompleted, setErrors, dispensed.payload]);

  return { step, setStep, saving, submitError, result, handleReview, handleConfirm };
};
