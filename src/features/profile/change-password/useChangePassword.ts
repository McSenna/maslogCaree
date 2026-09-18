import { useCallback, useMemo, useRef, useState } from "react";
import type { TextInput } from "react-native";

import {
  meetsAllPasswordRules,
  passwordStrength,
  type PasswordStrength,
} from "@/features/auth/forgotPassword/passwordRules";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

import type { ChangePasswordErrors, ChangePasswordFormValues } from "./changePassword.types";
import { changePasswordApi } from "./changePasswordService";

const INITIAL_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export type UseChangePasswordOptions = {
  onSuccess?: () => void;
};

export const useChangePassword = (options: UseChangePasswordOptions = {}) => {
  const { onSuccess } = options;

  const [values, setValues] = useState<ChangePasswordFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ChangePasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentRef = useRef<TextInput>(null);
  const newRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const strength: PasswordStrength = useMemo(
    () => passwordStrength(values.newPassword),
    [values.newPassword]
  );

  const setValue = useCallback((field: keyof ChangePasswordFormValues, text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
    setErrors((prev) => {
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
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: ChangePasswordErrors = {};

    if (!values.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required.";
    }

    if (!values.newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (values.currentPassword && values.newPassword === values.currentPassword) {
      newErrors.newPassword = "Your new password must be different from your current password.";
    } else if (!meetsAllPasswordRules(values.newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character.";
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (values.newPassword !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (newErrors.currentPassword) {
      currentRef.current?.focus();
      return false;
    }
    if (newErrors.newPassword) {
      newRef.current?.focus();
      return false;
    }
    if (newErrors.confirmPassword) {
      confirmRef.current?.focus();
      return false;
    }

    return Object.keys(newErrors).length === 0;
  }, [values]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await changePasswordApi({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      resetForm();
      onSuccess?.();
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to change your password. Please try again.");
      const lower = message.toLowerCase();

      if (lower.includes("current password")) {
        setErrors({ currentPassword: "Current password is incorrect." });
        currentRef.current?.focus();
      } else if (lower.includes("different")) {
        setErrors({ newPassword: "Your new password must be different from your current password." });
        newRef.current?.focus();
      } else if (lower.includes("match")) {
        setErrors({ confirmPassword: "Passwords do not match." });
        confirmRef.current?.focus();
      } else {
        setErrors({ general: message });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, validate, values, resetForm, onSuccess]);

  return {
    values,
    errors,
    isSubmitting,
    strength,
    setValue,
    resetForm,
    handleSubmit,
    showCurrent,
    showNew,
    showConfirm,
    toggleShowCurrent: () => setShowCurrent((v) => !v),
    toggleShowNew: () => setShowNew((v) => !v),
    toggleShowConfirm: () => setShowConfirm((v) => !v),
    currentRef,
    newRef,
    confirmRef,
    focusNew: () => newRef.current?.focus(),
    focusConfirm: () => confirmRef.current?.focus(),
  };
};
