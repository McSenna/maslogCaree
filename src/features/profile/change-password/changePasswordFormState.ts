// Relative `.ts` imports keep this loadable by `node --test`.
import type {
  ChangePasswordField,
  ChangePasswordFieldErrors,
  ChangePasswordFormValues,
} from "./changePassword.types.ts";
import { validateChangePassword, validateChangePasswordField } from "./changePasswordValidation.ts";

export type ChangePasswordFormState = {
  values: ChangePasswordFormValues;
  errors: ChangePasswordFieldErrors;
  /** Fields typed in at least once. Leaving an untouched field shows nothing yet. */
  edited: Partial<Record<ChangePasswordField, true>>;
};

export type ChangePasswordFormAction =
  | { type: "change"; field: ChangePasswordField; text: string }
  | { type: "blur"; field: ChangePasswordField }
  | { type: "submit" }
  | { type: "serverError"; field: ChangePasswordField; message: string }
  | { type: "reset" };

export const INITIAL_FORM_STATE: ChangePasswordFormState = {
  values: { currentPassword: "", newPassword: "", confirmPassword: "" },
  errors: {},
  edited: {},
};

// Typing in one field can settle an error shown on another: a new current
// password can make "same as current" untrue, a new password can make the
// confirmation match.
const DEPENDENTS: Record<ChangePasswordField, ChangePasswordField[]> = {
  currentPassword: ["currentPassword", "newPassword"],
  newPassword: ["newPassword", "confirmPassword"],
  confirmPassword: ["confirmPassword"],
};

const withFieldResult = (
  errors: ChangePasswordFieldErrors,
  field: ChangePasswordField,
  message: string | undefined
): ChangePasswordFieldErrors => {
  if (errors[field] === message) return errors;
  const next = { ...errors };
  if (message) next[field] = message;
  else delete next[field];
  return next;
};

export const changePasswordFormReducer = (
  state: ChangePasswordFormState,
  action: ChangePasswordFormAction
): ChangePasswordFormState => {
  switch (action.type) {
    case "change": {
      const values = { ...state.values, [action.field]: action.text };
      // Only errors already on screen are re-checked as the user types; new ones wait for blur or submit.
      const errors = DEPENDENTS[action.field]
        .filter((field) => state.errors[field])
        .reduce((acc, field) => withFieldResult(acc, field, validateChangePasswordField(field, values)), state.errors);
      return { values, errors, edited: { ...state.edited, [action.field]: true } };
    }
    case "blur":
      if (!state.edited[action.field]) return state;
      return {
        ...state,
        errors: withFieldResult(state.errors, action.field, validateChangePasswordField(action.field, state.values)),
      };
    case "submit":
      return { ...state, errors: validateChangePassword(state.values) };
    case "serverError":
      return { ...state, errors: { ...state.errors, [action.field]: action.message } };
    case "reset":
      return INITIAL_FORM_STATE;
  }
};

export const hasChangePasswordInput = (values: ChangePasswordFormValues): boolean =>
  Object.values(values).some((value) => value.length > 0);
