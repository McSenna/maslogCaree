import { useRef } from "react";
import { Platform, TextInput, View } from "react-native";
import { OTP_LENGTH } from "../recovery/otpConfig";
import { RECOVERY_COLORS as C } from "../recoveryTheme";

const OtpInput = ({
  value,
  onChange,
  onComplete,
  disabled,
  hasError,
}: {
  value: string;
  onChange: (next: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}) => {
  const inputs = useRef<(TextInput | null)[]>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? "");

  const commit = (next: string) => {
    onChange(next);
    if (next.length === OTP_LENGTH) onComplete?.(next);
  };

  const handleChange = (text: string, index: number) => {
    const clean = text.replace(/\D/g, "");
    if (!clean) return;

    const next = (
      value.slice(0, index) + clean + value.slice(index + clean.length)
    ).slice(0, OTP_LENGTH);

    commit(next);
    const focus = Math.min(index + clean.length, OTP_LENGTH - 1);
    inputs.current[focus]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key !== "Backspace") return;
    const target = digits[index] ? index : index - 1;
    if (target < 0) return;
    commit(value.slice(0, target) + value.slice(target + 1));
    inputs.current[target]?.focus();
  };

  return (
    <View className="w-full flex-row justify-between" accessibilityLabel="Verification code">
      {digits.map((digit, index) => {
        const filled = Boolean(digit);
        return (
          <TextInput
            key={index}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e.nativeEvent.key, index)}
            editable={!disabled}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
            maxLength={OTP_LENGTH}
            selectTextOnFocus
            accessibilityLabel={`Digit ${index + 1} of ${OTP_LENGTH}`}
            className="h-14 w-[14%] text-center text-[20px] font-bold"
            style={{
              borderRadius: 14,
              borderWidth: filled || hasError ? 1.5 : 1,
              borderColor: hasError ? C.error : filled ? C.primary : C.border,
              backgroundColor: hasError ? C.errorSoft : filled ? C.primarySoft : C.surface,
              color: C.text,
              opacity: disabled ? 0.6 : 1,
              ...Platform.select({ web: { outlineStyle: "none" } as object }),
            }}
          />
        );
      })}
    </View>
  );
};

export default OtpInput;
