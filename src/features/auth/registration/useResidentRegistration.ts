import { useCallback, useMemo, useState } from "react";

import { useProfilePhoto } from "../hooks/useProfilePhoto";
import { REGISTRATION_STEPS } from "./registrationOptions";
import { validateStep } from "./registrationValidation";
import { useEmailVerification } from "./hooks/useEmailVerification";
import { useRegistrationForm } from "./hooks/useRegistrationForm";
import { useRegistrationSubmit } from "./hooks/useRegistrationSubmit";

export type RegistrationController = ReturnType<typeof useResidentRegistration>;

export const useResidentRegistration = (onComplete?: () => void) => {
  const form = useRegistrationForm();
  const { values, stepIndex, isDirtyRef, setErrors, setTouched, setSubmitError, goToStep } = form;

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const photo = useProfilePhoto();
  const emailVerification = useEmailVerification(values.email);

  const { isSubmitting, registeredEmail, setRegisteredEmail, submit } = useRegistrationSubmit({
    values,
    profilePhoto: photo.photo,
    emailVerificationToken: emailVerification.token,
    agreedToTerms,
    setErrors,
    setTouched,
    setSubmitError,
    goToStep,
  });

  const step = REGISTRATION_STEPS[stepIndex];
  const isLastStep = stepIndex === REGISTRATION_STEPS.length - 1;
  const isSucceeded = Boolean(registeredEmail);

  const requiresEmailVerification = step.key === "personal" && !emailVerification.isVerified;

  const goNext = useCallback(() => {
    if (!form.validateCurrentStep()) return false;

    if (requiresEmailVerification) {
      setSubmitError("Please verify your email address before continuing.");
      return false;
    }

    form.advance();
    return true;
  }, [requiresEmailVerification, form, setSubmitError]);

  const reset = useCallback(() => {
    form.resetForm();
    setAgreedToTerms(false);
    setRegisteredEmail("");
    setShowOtpModal(false);
    photo.setPhoto(null);
    emailVerification.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, photo, setRegisteredEmail]);

  const completedSteps = useMemo(
    () =>
      REGISTRATION_STEPS.map(
        (entry, index) =>
          index < stepIndex && Object.keys(validateStep(entry.key, values)).length === 0
      ),
    [stepIndex, values]
  );

  return {
    values,
    errors: form.errors,
    touched: form.touched,
    setField: form.setField,
    blurField: form.blurField,
    photo,

    step,
    stepIndex,
    isLastStep,
    completedSteps,
    goNext,
    goBack: form.goBack,
    emailVerification,
    requiresEmailVerification,
    goToStep,

    agreedToTerms,
    setAgreedToTerms,
    canSubmit: agreedToTerms && !isSubmitting && emailVerification.isVerified,

    isSubmitting,
    submitError: form.submitError,
    submit,

    isSucceeded,
    registeredEmail,
    showOtpModal,
    openOtpModal: () => setShowOtpModal(true),
    closeOtpModal: () => setShowOtpModal(false),
    finish: () => {
      setShowOtpModal(false);
      reset();
      onComplete?.();
    },

    reset,
    hasUnsavedInput: () => isDirtyRef.current && !isSucceeded,
  };
};
