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
    leading={
      <View
        style={{
          flexShrink: 0,
          paddingRight: 10,
          borderRightWidth: 1,
          borderRightColor: REG_COLORS.border,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "600", color: REG_COLORS.muted }}>PH +63</Text>
      </View>
    }
  />
);

export default PhoneInput;
