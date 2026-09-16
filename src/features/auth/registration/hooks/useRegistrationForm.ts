import { useCallback, useRef, useState } from "react";

import { EMPTY_REGISTRATION, REGISTRATION_STEPS, type StepKey } from "../registrationOptions";
import {
  STEP_FIELDS,
  formatPhMobile,
  validateField,
  validateStep,
  type RegistrationErrors,
  type RegistrationField,
  type RegistrationValues,
} from "../registrationValidation";

export const useRegistrationForm = () => {
  const [values, setValues] = useState<RegistrationValues>(EMPTY_REGISTRATION);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [touched, setTouched] = useState<Partial<Record<RegistrationField, boolean>>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const isDirtyRef = useRef(false);

  const setField = useCallback((field: RegistrationField, raw: string) => {
    const value = field === "contactNumber" ? formatPhMobile(raw) : raw;
    isDirtyRef.current = true;
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const { [field]: _removed, ...rest } = previous;
      return rest;
    });
    setSubmitError("");
  }, []);

  const blurField = useCallback(
    (field: RegistrationField) => {
      setTouched((previous) => ({ ...previous, [field]: true }));
      const message = validateField(field, values);
      if (message) setErrors((previous) => ({ ...previous, [field]: message }));
    },
    [values]
  );

  const goToStep = useCallback((key: StepKey) => {
    const index = REGISTRATION_STEPS.findIndex((entry) => entry.key === key);
    if (index >= 0) setStepIndex(index);
  }, []);

  const goBack = useCallback(() => {
    setSubmitError("");
    setStepIndex((index) => Math.max(0, index - 1));
  }, []);

  const goNext = useCallback(() => {
    const step = REGISTRATION_STEPS[stepIndex];
    const stepErrors = validateStep(step.key, values);

    if (Object.keys(stepErrors).length > 0) {
      setErrors((previous) => ({ ...previous, ...stepErrors }));
      setTouched((previous) => ({
        ...previous,
        ...Object.fromEntries(STEP_FIELDS[step.key].map((field) => [field, true])),
      }));
      return false;
    }

    setStepIndex((index) => Math.min(REGISTRATION_STEPS.length - 1, index + 1));
    return true;
  }, [stepIndex, values]);

  const resetForm = useCallback(() => {
    setValues(EMPTY_REGISTRATION);
    setErrors({});
    setTouched({});
    setStepIndex(0);
    setSubmitError("");
    isDirtyRef.current = false;
  }, []);

  return {
    values,
    errors,
    touched,
    stepIndex,
    submitError,
    isDirtyRef,
    setErrors,
    setTouched,
    setSubmitError,
    setField,
    blurField,
    goToStep,
    goBack,
    goNext,
    resetForm,
  };
};
