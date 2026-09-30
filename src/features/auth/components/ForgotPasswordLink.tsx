import { useState } from "react";
import { Pressable, Text } from "react-native";
import { authCardStyles as styles } from "./authCardStyles";

type ForgotPasswordLinkProps = {
  onPress: () => void;
  marginBottom: number;
  disabled?: boolean;
};

const ForgotPasswordLink = ({ onPress, marginBottom, disabled = false }: ForgotPasswordLinkProps) => {
  const [active, setActive] = useState(false);

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel="Forgot password"
      accessibilityState={{ disabled }}
      focusable={!disabled}
      disabled={disabled}
      onPress={onPress}
      onHoverIn={() => setActive(true)}
      onHoverOut={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      style={[
        styles.forgotContainer,
        { marginBottom },
        active && !disabled && styles.forgotContainerActive,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={[styles.forgotText, active && !disabled && styles.forgotTextActive]}>
        Forgot password?
      </Text>
    </Pressable>
  );
};

export default ForgotPasswordLink;
