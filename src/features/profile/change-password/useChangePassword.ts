import { useCallback, useMemo, useRef, useState } from "react";
import type { TextInput } from "react-native";

import { passwordStrength, type PasswordStrength } from "@/features/auth/forgotPassword/passwordRules";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { reportError } from "@/utils/errorReporting";

import type { ChangePasswordErrors, ChangePasswordFormValues } from "./changePassword.types";
import {
  createSubmitGate,
  outcomeForFailure,
  outcomeForResponse,
  type ChangePasswordOutcome,
} from "./changePasswordOutcome";
import { changePasswordApi } from "./changePasswordService";
import { validateChangePassword } from "./changePasswordValidation";
import { toastError } from "@/utils/errorToast/toastError";

const INITIAL_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const FIELD_ORDER: (keyof ChangePasswordFormValues)[] = ["currentPassword", "newPassword", "confirmPassword"];

// A retry after an unanswered attempt usually hears "Current password is
// incorrect" because the first one went through, so the warning stays up.
const keepUnconfirmed = (prev: ChangePasswordErrors): ChangePasswordErrors =>
  prev.unconfirmed ? { unconfirmed: prev.unconfirmed } : {};

export type UseChangePasswordOptions = {
  onSuccess?: () => void;
};

export const useChangePassword = (options: UseChangePasswordOptions = {}) => {
  const { onSuccess } = options;

  const [values, setValues] = useState<ChangePasswordFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ChangePasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitGate = useMemo(() => createSubmitGate(), []);

  const currentRef = useRef<TextInput>(null);
  const newRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const fieldRefs = useMemo(
    () => ({ currentPassword: currentRef, newPassword: newRef, confirmPassword: confirmRef }),
    []
  );

  const strength: PasswordStrength = useMemo(
    () => passwordStrength(values.newPassword),
    [values.newPassword]
  );

  const setValue = useCallback((field: keyof ChangePasswordFormValues, text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
    setErrors((prev) => {
      // `unconfirmed` stays: editing a field does not answer whether the last change went through.
      if (!prev[field] && !prev.general) return prev;
      const next = { ...prev };
      delete next[field];
      delete next.general;
      return next;
    });
  }, []);

  const resetForm = useCallback(() => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors = validateChangePassword(values);
    setErrors((prev) => ({ ...keepUnconfirmed(prev), ...newErrors }));

    const firstInvalid = FIELD_ORDER.find((field) => newErrors[field]);
    if (!firstInvalid) return true;
    fieldRefs[firstInvalid].current?.focus();
    return false;
  }, [values, fieldRefs]);

  const send = useCallback(async (): Promise<ChangePasswordOutcome> => {
    setIsSubmitting(true);
    setErrors(keepUnconfirmed);
    try {
      return outcomeForResponse(
        await changePasswordApi({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        })
      );
    } catch (error) {
      const outcome = outcomeForFailure(normalizeApiError(error));
      // Only a server refusal proves nothing changed. A refused session is
      // explained by the sign-out notice the API client already raised.
      if (outcome.kind === "rejected") toastError("Password not changed", error, { inline: true });
      if (outcome.kind === "unconfirmed") reportError("Password change not confirmed", error);
      return outcome;
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);

  const handleSubmit = useCallback(async () => {
    const outcome = await submitGate(async () => (validate() ? send() : undefined));
    if (!outcome) return;

    // Outside the request's catch, so a failing follow-up can never read as a failed change.
    if (outcome.kind === "changed") {
      resetForm();
      onSuccess?.();
      return;
    }
    if (outcome.kind === "unconfirmed") {
      setErrors({ unconfirmed: outcome.message });
      return;
    }
    if (outcome.kind !== "rejected") return;

    const rejection = outcome.field ? { [outcome.field]: outcome.message } : { general: outcome.message };
    setErrors((prev) => ({ ...keepUnconfirmed(prev), ...rejection }));
    if (outcome.field) fieldRefs[outcome.field].current?.focus();
  }, [submitGate, validate, send, resetForm, onSuccess, fieldRefs]);

  return {
    values,
    errors,
    isSubmitting,
    strength,
    setValue,
    resetForm,
    handleSubmit,
    currentRef,
    newRef,
    confirmRef,
    focusNew: () => newRef.current?.focus(),
    focusConfirm: () => confirmRef.current?.focus(),
  };
};
