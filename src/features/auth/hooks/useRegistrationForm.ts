import { useCallback, useRef, useState } from "react";
import type { ScrollView } from "react-native";
import { registerResident } from "@/services/auth";
import { getAuthErrorPresentation } from "@/utils/authErrorMessages";
import { showAlert } from "@/utils/notify";
import { FIELD_SCROLL_OFFSETS } from "../constants/registrationFields";
import {
  validateRegistration,
  type RegistrationErrors,
  type RegistrationValues,
} from "../utils/registrationValidation";
import { useProfilePhoto } from "./useProfilePhoto";

const EMPTY_VALUES: RegistrationValues = {
  fullname: "",
  email: "",
  password: "",
  gender: "male",
  dateOfBirth: "",
  address: "",
};

/**
 * The resident sign-up form: its values, its per-field errors, the photo, and
 * the two-step submit that ends at OTP verification.
 *
 * Registration is not complete when this form submits — the account exists but
 * is unverified until the code is entered — which is why the form is only
 * cleared once the OTP modal closes, either verified or abandoned.
 */
export function useRegistrationForm(onRegistrationSuccess?: () => void) {
  const [values, setValues] = useState<RegistrationValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  const clearError = useCallback((field: string) => {
    setErrors((previous) => ({ ...previous, [field]: "" }));
  }, []);

  const photo = useProfilePhoto(() => clearError("profileImage"));

  /** Editing a field clears the complaint about it, rather than waiting for resubmit. */
  const setField = useCallback(
    (field: keyof RegistrationValues, value: string) => {
      setValues((previous) => ({ ...previous, [field]: value }));
      clearError(field);
    },
    [clearError]
  );

  const focusField = useCallback((field: string) => {
    setFocusedField(field);
    const offset = FIELD_SCROLL_OFFSETS[field];
    if (offset != null) scrollRef.current?.scrollTo({ y: offset, animated: true });
  }, []);

  const blurField = useCallback(() => setFocusedField(null), []);

  const { setPhoto } = photo;
  const resetForm = useCallback(() => {
    setValues(EMPTY_VALUES);
    setPhoto(null);
    setErrors({});
  }, [setPhoto]);

  const submit = useCallback(async () => {
    const nextErrors = validateRegistration(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || isLoading) return;

    setIsLoading(true);
    try {
      const result = await registerResident({
        fullname: values.fullname.trim(),
        email: values.email.trim(),
        password: values.password,
        gender: values.gender.toLowerCase(),
        dateOfBirth: values.dateOfBirth.trim(),
        address: values.address.trim(),
        // Stored directly in MongoDB as base64 (data URI).
        ...(photo.photo ? { profilePhoto: photo.photo } : {}),
      });
      setRegisteredEmail(result.email);
      setShowOtpModal(true);
    } catch (error: unknown) {
      const { title, message } = getAuthErrorPresentation(
        error,
        "Registration Failed",
        "Registration failed. Please try again."
      );
      showAlert(title, message);
    } finally {
      setIsLoading(false);
    }
  }, [values, isLoading, photo.photo]);

  /** The code was accepted: clear the form and hand back to the caller. */
  const handleOtpVerified = useCallback(() => {
    setShowOtpModal(false);
    resetForm();
    onRegistrationSuccess?.();
  }, [resetForm, onRegistrationSuccess]);

  /**
   * The OTP sheet was dismissed without a code.
   *
   * The form is still cleared: the account was created, so re-submitting the
   * same details would only be refused as a duplicate.
   */
  const handleOtpDismissed = useCallback(() => {
    setShowOtpModal(false);
    resetForm();
  }, [resetForm]);

  return {
    values,
    errors,
    setField,
    focusedField,
    focusField,
    blurField,
    scrollRef,
    showPassword,
    toggleShowPassword: () => setShowPassword((previous) => !previous),
    isLoading,
    submit,
    photo,
    showDatePicker,
    openDatePicker: () => setShowDatePicker(true),
    closeDatePicker: () => setShowDatePicker(false),
    setDateOfBirth: (date: string) => setField("dateOfBirth", date),
    showOtpModal,
    registeredEmail,
    handleOtpVerified,
    handleOtpDismissed,
  };
}
