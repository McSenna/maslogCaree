import { useState } from "react";
import {
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LANDING_COLORS } from "@/config/landingAssets";
import { INPUT_SHELL_PROPS } from "@/components/ui/inputShell";
import PasswordToggle from "./authInput/PasswordToggle";
import { AUTH_INPUT_COLORS, authInputStyles as styles } from "./authInput/authInputStyles";

interface AuthInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  hasError?: boolean;
  disabled?: boolean;
  height?: number;
  fontSize?: number;
}

const AuthInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete,
  textContentType,
  returnKeyType,
  onSubmitEditing,
  accessibilityLabel,
  accessibilityHint,
  hasError = false,
  disabled = false,
  height = 60,
  fontSize = 16,
}: AuthInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const effectiveSecure = secureTextEntry && !isPasswordVisible;

  const iconColor = disabled
    ? AUTH_INPUT_COLORS.disabledText
    : hasError
      ? AUTH_INPUT_COLORS.error
      : isFocused
        ? LANDING_COLORS.primaryBlue
        : AUTH_INPUT_COLORS.icon;

  return (
    <View
      {...INPUT_SHELL_PROPS}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={[
        styles.container,
        { height },
        isHovered && !isFocused && !disabled && styles.containerHovered,
        isFocused && styles.containerFocused,
        hasError && styles.containerError,
        hasError && isFocused && styles.containerErrorFocused,
        disabled && styles.containerDisabled,
      ]}
    >
      <Ionicons name={icon} size={20} color={iconColor} style={styles.leftIcon} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={effectiveSecure}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        textContentType={textContentType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[styles.input, { fontSize }, disabled && styles.inputDisabled]}
        placeholderTextColor={AUTH_INPUT_COLORS.placeholder}
        accessibilityLabel={accessibilityLabel || placeholder}
        accessibilityHint={accessibilityHint}
        underlineColorAndroid="transparent"
      />

      {secureTextEntry ? (
        <PasswordToggle
          visible={isPasswordVisible}
          disabled={disabled}
          onToggle={() => setIsPasswordVisible((prev) => !prev)}
        />
      ) : null}
    </View>
  );
};

export default AuthInput;
