import type { RefObject } from "react";
import { TextInput, View } from "react-native";

import { INPUT_SHELL_PROPS } from "@/components/ui/inputShell";
import { RADIUS } from "@/design/adminSurfaces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import SupportFieldShell from "./SupportFieldShell";

type SupportTextFieldProps = {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  keyboardType?: "default" | "phone-pad" | "email-address";
  returnKeyType?: "done" | "next";
  onSubmitEditing?: () => void;
  inputRef?: RefObject<TextInput | null>;
};

const SupportTextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  error,
  required = false,
  readOnly = false,
  maxLength,
  keyboardType = "default",
  returnKeyType,
  onSubmitEditing,
  inputRef,
}: SupportTextFieldProps) => {
  const palette = useResidentDialogPalette();

  return (
    <SupportFieldShell label={label} required={required} hint={hint} error={error}>
      <View
        {...INPUT_SHELL_PROPS}
        style={{
          minHeight: 50,
          justifyContent: "center",
          paddingHorizontal: 12,
          borderRadius: RADIUS.control,
          backgroundColor: readOnly ? palette.card : palette.cardRaised,
          borderWidth: 1,
          borderColor: error ? palette.danger : palette.border,
        }}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          editable={!readOnly}
          placeholder={placeholder}
          placeholderTextColor={palette.muted}
          accessibilityLabel={label}
          maxLength={maxLength}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          submitBehavior={returnKeyType === "next" ? "submit" : undefined}
          autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
          style={{ fontSize: 14, color: readOnly ? palette.muted : palette.body, outlineStyle: "none" } as never}
        />
      </View>
    </SupportFieldShell>
  );
};

export default SupportTextField;
