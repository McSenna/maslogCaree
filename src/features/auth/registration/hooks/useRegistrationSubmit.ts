import { useCallback, useState } from "react";

import { registerResident } from "@/services/auth";
import { getAuthErrorPresentation } from "@/utils/authErrorMessages";

import { EMPTY_REGISTRATION, REGISTRATION_STEPS, type StepKey } from "../registrationOptions";
import {
  validateStep,
  type RegistrationErrors,
  type RegistrationField,
  type RegistrationValues,
} from "../registrationValidation";
import { buildRegistrationPayload } from "./buildRegistrationPayload";
import { SERVER_FIELD_ALIASES, stepOwning } from "./registrationFieldMapping";

type Options = {
  values: RegistrationValues;
  profilePhoto: string | null;
  emailVerificationToken: string;
  agreedToTerms: boolean;
  setErrors: React.Dispatch<React.SetStateAction<RegistrationErrors>>;
  setTouched: React.Dispatch<
    React.SetStateAction<Partial<Record<RegistrationField, boolean>>>
  >;
  setSubmitError: (message: string) => void;
  goToStep: (key: StepKey) => void;
};

export const useRegistrationSubmit = ({
  values,
  profilePhoto,
  emailVerificationToken,
  agreedToTerms,
  setErrors,
  setTouched,
  setSubmitError,
  goToStep,
}: Options) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const applyServerFieldErrors = useCallback(
    (fieldErrors: Record<string, string>) => {
      const mapped: RegistrationErrors = {};
      Object.entries(fieldErrors).forEach(([key, message]) => {
        const field = (SERVER_FIELD_ALIASES[key] ?? key) as RegistrationField;
        if (field in EMPTY_REGISTRATION) mapped[field] = message;
      });

      const fields = Object.keys(mapped) as RegistrationField[];
      if (fields.length === 0) return false;

      setErrors((previous) => ({ ...previous, ...mapped }));
      setTouched((previous) => ({
        ...previous,
        ...Object.fromEntries(fields.map((field) => [field, true])),
      }));
      goToStep(stepOwning(fields[0]));
      return true;
    },
    [goToStep, setErrors, setTouched]
  );

  const submit = useCallback(async () => {
    if (isSubmitting || !agreedToTerms) return;

    const allErrors = REGISTRATION_STEPS.reduce<RegistrationErrors>(
      (accumulated, entry) => ({ ...accumulated, ...validateStep(entry.key, values) }),
      {}
    );

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      goToStep(stepOwning(Object.keys(allErrors)[0] as RegistrationField));
      return;
    }

    if (!emailVerificationToken) {
      setSubmitError("Please verify your email address before submitting your registration.");
      goToStep("personal");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const result = await registerResident(
        buildRegistrationPayload(values, profilePhoto, emailVerificationToken)
      );
      setRegisteredEmail(result.email);
    } catch (error: unknown) {
      const { message, normalized } = getAuthErrorPresentation(
        error,
        "Registration Failed",
        "We could not create your account. Please try again."
      );
      const placed = normalized.fieldErrors
        ? applyServerFieldErrors(normalized.fieldErrors)
        : false;
      if (!placed) setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    agreedToTerms,
    values,
    profilePhoto,
    emailVerificationToken,
    goToStep,
    applyServerFieldErrors,
    setErrors,
    setSubmitError,
  ]);

  return { isSubmitting, registeredEmail, setRegisteredEmail, submit };
};
