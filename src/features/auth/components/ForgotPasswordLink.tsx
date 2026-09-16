import { useState } from "react";
import { Pressable, Text } from "react-native";
import { authCardStyles as styles } from "./authCardStyles";

type ForgotPasswordLinkProps = {
  onPress: () => void;
  marginBottom: number;
};

const ForgotPasswordLink = ({ onPress, marginBottom }: ForgotPasswordLinkProps) => {
  const [active, setActive] = useState(false);

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel="Forgot password"
      focusable
      onPress={onPress}
      onHoverIn={() => setActive(true)}
      onHoverOut={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      style={[
        styles.forgotContainer,
        { marginBottom },
        active && styles.forgotContainerActive,
      ]}
    >
      <Text style={[styles.forgotText, active && styles.forgotTextActive]}>
        Forgot Password?
      </Text>
    </Pressable>
  );
};

export default ForgotPasswordLink;
