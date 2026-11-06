import { useId, type ReactNode, type Ref } from "react";
import type { ReturnKeyTypeOptions, TextInput } from "react-native";

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/features/auth/forgotPassword/passwordRules";

import TextField from "./TextField";

export type PasswordPurpose = "current" | "new";

type PasswordFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  /** Decides the autofill hints, so password managers fill the current one and offer to save the new one. */
  purpose: PasswordPurpose;
  error?: string;
  inputRef?: Ref<TextInput>;
  toggleLabels: { show: string; hide: string };
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  initialFocus?: boolean;
  disabled?: boolean;
  labelPosition?: "top" | "start";
  labelWidth?: number;
  below?: ReactNode;
  describedBy?: string;
};

// iOS strong-password suggestions follow these, so a suggested password already passes the policy.
const IOS_PASSWORD_RULES = `minlength: ${PASSWORD_MIN_LENGTH}; maxlength: ${PASSWORD_MAX_LENGTH}; required: lower; required: upper; required: digit; required: special;`;

const AUTOFILL = {
  current: { autoComplete: "current-password", textContentType: "password" },
  new: { autoComplete: "new-password", textContentType: "newPassword" },
} as const;

/**
 * A password input with its own show/hide toggle. Never trims, never blocks
 * paste, and caps length only at the policy maximum the server enforces.
 */
const PasswordField = ({
  purpose,
  value,
  onChangeText,
  onBlur,
  error,
  ...props
}: PasswordFieldProps) => {
  const inputId = useId();

  return (
    <TextField
      {...props}
      {...AUTOFILL[purpose]}
      inputId={inputId}
      size="lg"
      secureToggle
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      error={error}
      passwordRules={purpose === "new" ? IOS_PASSWORD_RULES : undefined}
      importantForAutofill="yes"
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      maxLength={PASSWORD_MAX_LENGTH}
      // "Next" moves on without dropping the keyboard; "Done" closes it as it submits.
      submitBehavior={props.returnKeyType === "next" ? "submit" : "blurAndSubmit"}
    />
  );
};

export default PasswordField;
