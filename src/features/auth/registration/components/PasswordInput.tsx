import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { REG_COLORS } from "../registrationTheme";
import RegistrationInput, { type RegistrationInputProps } from "./RegistrationInput";

type PasswordInputProps = Omit<
  RegistrationInputProps,
  "trailing" | "secureTextEntry" | "icon" | "keyboardType" | "autoCapitalize"
> & {
  autoComplete?: RegistrationInputProps["autoComplete"];
};

const PasswordInput = ({ autoComplete = "new-password", ...props }: PasswordInputProps) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <RegistrationInput
      {...props}
      icon="lock"
      secureTextEntry={!revealed}
      autoCapitalize="none"
      autoComplete={autoComplete}
      textContentType="newPassword"
      trailing={
        <Pressable
          onPress={() => setRevealed((current) => !current)}
          accessibilityRole="button"
          accessibilityLabel={revealed ? "Hide password" : "Show password"}
          hitSlop={12}
          style={{ padding: 4 }}
        >
          <Feather name={revealed ? "eye-off" : "eye"} size={17} color={REG_COLORS.muted} />
        </Pressable>
      }
    />
  );
};

export default PasswordInput;
