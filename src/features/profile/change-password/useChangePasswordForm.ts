import { useCallback, useMemo, useReducer, useRef } from "react";
import type { TextInput } from "react-native";

import type { ChangePasswordField, ChangePasswordFieldErrors } from "./changePassword.types";
import {
  INITIAL_FORM_STATE,
  changePasswordFormReducer,
  hasChangePasswordInput,
} from "./changePasswordFormState";
import { CHANGE_PASSWORD_FIELDS, validateChangePassword } from "./changePasswordValidation";

/** Field values, shown errors and focus for the three password inputs. Nothing here talks to the server. */
export const useChangePasswordForm = () => {
  const [state, dispatch] = useReducer(changePasswordFormReducer, INITIAL_FORM_STATE);

  const currentRef = useRef<TextInput>(null);
  const newRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const refs = useMemo(
    () => ({ currentPassword: currentRef, newPassword: newRef, confirmPassword: confirmRef }),
    []
  );

  const setValue = useCallback(
    (field: ChangePasswordField, text: string) => dispatch({ type: "change", field, text }),
    []
  );
  const blurField = useCallback((field: ChangePasswordField) => dispatch({ type: "blur", field }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const focusField = useCallback((field: ChangePasswordField) => refs[field].current?.focus(), [refs]);

  /** Shows every error at once and moves focus to the first field that needs attention. */
  const validateAll = useCallback((): boolean => {
    dispatch({ type: "submit" });
    const errors: ChangePasswordFieldErrors = validateChangePassword(state.values);
    const firstInvalid = CHANGE_PASSWORD_FIELDS.find((field) => errors[field]);
    if (!firstInvalid) return true;
    focusField(firstInvalid);
    return false;
  }, [state.values, focusField]);

  const showServerError = useCallback(
    (field: ChangePasswordField, message: string) => {
      dispatch({ type: "serverError", field, message });
      focusField(field);
    },
    [focusField]
  );

  return {
    values: state.values,
    errors: state.errors,
    isDirty: hasChangePasswordInput(state.values),
    refs,
    setValue,
    blurField,
    reset,
    focusField,
    validateAll,
    showServerError,
  };
};

export type ChangePasswordFormApi = ReturnType<typeof useChangePasswordForm>;
