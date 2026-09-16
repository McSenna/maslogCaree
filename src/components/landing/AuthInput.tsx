import { useState } from "react";
import { TextInput, View, type KeyboardTypeOptions, type TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LANDING_COLORS } from "@/config/landingAssets";
import { INPUT_SHELL_PROPS } from "@/components/ui/inputShell";
import PasswordToggle from "./authInput/PasswordToggle";
import { authInputStyles as styles } from "./authInput/authInputStyles";

interface AuthInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  accessibilityLabel?: string;
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
  accessibilityLabel,
  height = 60,
  fontSize = 16,
}: AuthInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const effectiveSecure = secureTextEntry && !isPasswordVisible;

  const isMailIcon = icon === "mail-outline";
  const iconColor = isFocused
    ? LANDING_COLORS.primaryBlue
    : isMailIcon
      ? LANDING_COLORS.primaryBlue
      : "#64748B";

  return (
    <View {...INPUT_SHELL_PROPS} style={[styles.container, { height }, isFocused && styles.containerFocused]}>
      <Ionicons name={icon} size={20} color={iconColor} style={styles.leftIcon} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={effectiveSecure}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[styles.input, { fontSize }]}
        placeholderTextColor="#8A9BA8"
        accessibilityLabel={accessibilityLabel || placeholder}
        underlineColorAndroid="transparent"
      />

      {secureTextEntry ? (
        <PasswordToggle visible={isPasswordVisible} onToggle={() => setIsPasswordVisible((prev) => !prev)} />
      ) : null}
    </View>
  );
};

export default AuthInput;
