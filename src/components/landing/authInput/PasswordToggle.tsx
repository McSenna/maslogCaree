import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import { AUTH_INPUT_COLORS, authInputStyles } from "./authInputStyles";

type PasswordToggleProps = {
  visible: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

const PasswordToggle = ({ visible, onToggle, disabled = false }: PasswordToggleProps) => {
  const [active, setActive] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={visible ? "Hide password" : "Show password"}
      accessibilityState={{ disabled }}
      focusable={!disabled}
      disabled={disabled}
      onPress={onToggle}
      onHoverIn={() => setActive(true)}
      onHoverOut={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      style={[authInputStyles.eyeButton, active && authInputStyles.eyeButtonActive]}
      hitSlop={8}
    >
      <Ionicons
        name={visible ? "eye-outline" : "eye-off-outline"}
        size={20}
        color={active ? LANDING_COLORS.primaryBlue : AUTH_INPUT_COLORS.icon}
      />
    </Pressable>
  );
};

export default PasswordToggle;
