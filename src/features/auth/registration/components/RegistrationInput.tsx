import { useState, type ReactNode } from "react";
import { Feather } from "@expo/vector-icons";
import { Platform, TextInput, View, type TextInputProps } from "react-native";
import { REG_COLORS } from "../registrationTheme";
import FieldShell from "./FieldShell";
import { INPUT_SHELL_PROPS } from "@/components/ui/inputShell";
import { fieldSurface, fieldTextColor } from "./fieldStyles";

export type RegistrationInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  icon?: keyof typeof Feather.glyphMap;
  required?: boolean;
  optional?: boolean;
  helper?: string;
  error?: string;
  disabled?: boolean;
  height: number;
  /** Sits between the icon and the text, e.g. a country code. */
  leading?: ReactNode;
  trailing?: ReactNode;
  onBlur?: () => void;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
  secureTextEntry?: boolean;
  maxLength?: number;
  accessibilityHint?: string;
};

const RegistrationInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  required,
  optional,
  helper,
  error,
  disabled,
  height,
  leading,
  trailing,
  onBlur,
  accessibilityHint,
  ...inputProps
}: RegistrationInputProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <FieldShell
      label={label}
      required={required}
      optional={optional}
      helper={helper}
      error={error}
    >
      <View
        {...INPUT_SHELL_PROPS}
        style={{
          flexDirection: "row",
          alignItems: "center",
          height,
          paddingHorizontal: 14,
          gap: 10,
          ...fieldSurface({ focused, invalid: Boolean(error), disabled }),
        }}
      >
        {icon ? (
          <Feather
            name={icon}
            size={17}
            color={error ? REG_COLORS.error : focused ? REG_COLORS.primary : REG_COLORS.subtle}
          />
        ) : null}

        {leading}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={REG_COLORS.subtle}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          accessibilityLabel={label}
          accessibilityHint={accessibilityHint}
          style={[
            // minWidth 0: a web <input> otherwise keeps ~20 characters of width and pushes the trailing slot out.
            { flex: 1, minWidth: 0, height: "100%", fontSize: 17, color: fieldTextColor(disabled) },
            Platform.OS === "web" ? ({ outlineStyle: "none" } as never) : null,
          ]}
          {...inputProps}
        />

        {trailing}
      </View>
    </FieldShell>
  );
};

export default RegistrationInput;
