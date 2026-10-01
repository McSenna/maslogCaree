import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { TextInput, View, type TextInputProps } from "react-native";

import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "./appointmentTheme";
import FieldErrorText from "./FieldErrorText";
import FieldLabel from "./FieldLabel";

type FormTextInputProps = Pick<TextInputProps, "autoCapitalize" | "autoComplete" | "textContentType" | "maxLength"> & {
  label: string;
  required?: boolean;
  placeholder: string;
  icon: keyof typeof Feather.glyphMap;
  value: string;
  onChangeText: (next: string) => void;
  error?: string | null;
};

/** Single-line field in the booking form's style, the short sibling of FormTextArea. */
const FormTextInput = ({ label, required = false, placeholder, icon, value, onChangeText, error = null, ...inputProps }: FormTextInputProps) => {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const accent = hasError ? APPOINTMENT_COLORS.danger : APPOINTMENT_COLORS.primaryBright;

  return (
    <View className="w-full">
      <FieldLabel label={label} required={required} />
      <View
        className="flex-row items-center px-3"
        style={{
          minHeight: APPOINTMENT_METRICS.fieldHeight,
          gap: 9,
          borderRadius: APPOINTMENT_METRICS.radiusField,
          borderWidth: hasError || focused ? 1.5 : 1,
          borderColor: hasError || focused ? accent : APPOINTMENT_COLORS.border,
          backgroundColor: APPOINTMENT_COLORS.white,
        }}
      >
        <Feather name={icon} size={18} color={accent} />
        <TextInput
          accessibilityLabel={required ? `${label}, required` : label}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={APPOINTMENT_COLORS.placeholder}
          className="min-w-0 flex-1"
          style={[TYPE.body, { color: APPOINTMENT_COLORS.bodyText, paddingVertical: 12, ...webStyle({ outlineStyle: "none" }) }]}
          {...inputProps}
        />
      </View>
      <FieldErrorText message={error} />
    </View>
  );
};

export default FormTextInput;
