import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LANDING_COLORS } from "@/config/landingAssets";

interface AuthInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  accessibilityLabel?: string;
}

/**
 * Modern outlined input field for the MaslogCare auth card.
 *
 * Features:
 * - Blue mail icon / slate lock icon matching reference UI
 * - Subtle border with clear focus state
 * - Password visibility toggle (eye / eye-off)
 */
const AuthInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  accessibilityLabel,
}: AuthInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const showToggle = secureTextEntry;
  const effectiveSecure = secureTextEntry && !isPasswordVisible;

  // In the reference mockup, the mail icon is blue (#0866F5)
  const isMailIcon = icon === "mail-outline";
  const iconColor = isFocused
    ? LANDING_COLORS.primaryBlue
    : isMailIcon
      ? LANDING_COLORS.primaryBlue
      : "#64748B";

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.containerFocused,
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={iconColor}
        style={styles.leftIcon}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={effectiveSecure}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.input}
        placeholderTextColor="#8A9BA8"
        accessibilityLabel={accessibilityLabel || placeholder}
      />

      {showToggle && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
          onPress={() => setIsPasswordVisible((prev) => !prev)}
          style={styles.eyeButton}
          hitSlop={8}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#64748B"
          />
        </Pressable>
      )}
    </View>
  );
}

const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  default: "sans-serif",
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    borderWidth: 1,
    borderColor: "#D9E3EF",
    borderRadius: 13,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    gap: 12,
  },
  containerFocused: {
    borderColor: LANDING_COLORS.primaryBlue,
    borderWidth: 1.8,
    backgroundColor: LANDING_COLORS.white,
  },
  leftIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONT_FAMILY,
    color: LANDING_COLORS.navy,
    paddingVertical: 0,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      } as any,
    }),
  },
  eyeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    ...Platform.select({
      web: {
        cursor: "pointer",
      } as any,
    }),
  },
});

export default AuthInput
