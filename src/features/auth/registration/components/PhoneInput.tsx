import { Text, View } from "react-native";
import { REG_COLORS } from "../registrationTheme";
import RegistrationInput, { type RegistrationInputProps } from "./RegistrationInput";

type PhoneInputProps = Omit<
  RegistrationInputProps,
  "icon" | "keyboardType" | "autoCapitalize" | "maxLength"
>;

const PhoneInput = (props: PhoneInputProps) => (
  <RegistrationInput
    {...props}
    icon="phone"
    keyboardType="phone-pad"
    autoComplete="tel"
    textContentType="telephoneNumber"
    maxLength={13}
    trailing={
      <View
        style={{
          paddingLeft: 10,
          borderLeftWidth: 1,
          borderLeftColor: REG_COLORS.border,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "600", color: REG_COLORS.muted }}>PH +63</Text>
      </View>
    }
  />
);

export default PhoneInput;
