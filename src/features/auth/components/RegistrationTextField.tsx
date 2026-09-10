import type { ReactNode } from "react";
import { Feather } from "@expo/vector-icons";
import { TextInput, View, type KeyboardTypeOptions, type TextInputProps } from "react-native";
import { FIELD_COLORS } from "../constants/registrationFields";
import FieldError from "./FieldError";
import FieldLabel from "./FieldLabel";

type RegistrationTextFieldProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  /** The address field, which grows into a small text area. */
  multiline?: boolean;
  /** The password field's reveal toggle. */
  trailing?: ReactNode;
};

/**
 * One labelled input, with its focus tint and its error message.
 *
 * The same block appeared once per field in the registration form; naming it
 * is what keeps the field colours, the error row and the 46px control height
 * consistent across all of them.
 */
export default function RegistrationTextField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  error,
  focused,
  onFocus,
  onBlur,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  multiline = false,
  trailing,
}: RegistrationTextFieldProps) {
  const borderColor = error
    ? FIELD_COLORS.borderError
    : focused
      ? FIELD_COLORS.borderFocused
      : FIELD_COLORS.border;
  const backgroundColor = focused ? FIELD_COLORS.backgroundFocused : FIELD_COLORS.background;
  const iconColor = focused ? FIELD_COLORS.iconFocused : FIELD_COLORS.icon;

  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <View
        className={
          multiline
            ? "flex-row items-start rounded-xl border px-3 pt-3"
            : "flex-row items-center rounded-xl border px-3"
        }
        style={{ borderColor, backgroundColor, ...(multiline ? { minHeight: 80 } : { height: 46 }) }}
      >
        <Feather
          name={icon}
          size={14}
          color={iconColor}
          style={multiline ? { marginTop: 1 } : undefined}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={FIELD_COLORS.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? 3 : undefined}
          textAlignVertical={multiline ? "top" : undefined}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`flex-1 pl-2.5 text-sm text-slate-800${multiline ? " pb-3" : ""}`}
        />
        {trailing}
      </View>
      <FieldError message={error} />
    </View>
  );
}
